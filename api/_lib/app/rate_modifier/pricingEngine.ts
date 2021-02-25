import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import {
    IHotel, IRateModifier,
    IRateModifierCollection, IRateModifierConditionType, IRoomType
} from '../../common/types'
import { CError } from "../../common/tools";
import { HTTP_STATUS } from "../../common/constants/http_status"
import { TimeBasedCache } from "../../common/cache/timeBasedCache";

const moment = extendMoment(Moment)
const repository = new RateModifierRepo()

//naive cache implementation
//-it's used to avoid making frequent calls to retrieve rateModifiers for the same hotel (since it would be called 10 times if there are 10 rooms)
//-it should not store cache between search calls
//TODO - once we expect to have many hotels existing in the same database we need to replace this with dedicated cache (e.g. REDIS)

const CACHE_ENTRIES_EVICTION_TIME_MILLIS=5000;  //remove entries from cache after 5 secs.
const hotelRateModifiersCache = new TimeBasedCache<string, IRateModifierCollection>(CACHE_ENTRIES_EVICTION_TIME_MILLIS)

//return all available rate modifiers for a given hotel and room
//it uses cache (lazy loading) - if cache is empty, it will load rate modifiers into cache and all consecutive calls will return cached values
async function getHotelAndRoomRateModifiers(hotelId: string, roomTypeId: string): Promise<IRateModifierCollection> {
    let hotelRateModifiers:IRateModifierCollection|undefined;
    //check if rate modifiers for a given hotel were already loaded before
    hotelRateModifiers = hotelRateModifiersCache.get(hotelId)
    if (hotelRateModifiers) {
        //it was in cache - return cached values
        hotelRateModifiers = hotelRateModifiersCache.get(hotelId);
        if(!hotelRateModifiers)
            {hotelRateModifiers=[];}
        //return only active and applicable modifiers (e.g. remove modifiers assigned to other room types)
        return getApplicableRoomRateModifiers(hotelRateModifiers,roomTypeId);
    }
    //nothing in cache - load it from the database
    hotelRateModifiers = await repository.getRateModifiersByHotelId(hotelId);
    if (!hotelRateModifiers) {
        hotelRateModifiers = [];
    }
    //store in cache
    hotelRateModifiersCache.put(hotelId, hotelRateModifiers);
    return getApplicableRoomRateModifiers(hotelRateModifiers,roomTypeId);
}

//return all applicable rate modifiers for a given room
function getApplicableRoomRateModifiers(hotelRateModifiers:IRateModifierCollection, roomTypeId: string): IRateModifierCollection {
    let roomRateModifiers: IRateModifierCollection  = filterOnlyRoomRateModifiers(hotelRateModifiers, roomTypeId)
    roomRateModifiers = removeInactiveRateModifiers(roomRateModifiers)
    roomRateModifiers = sortRateModifiersByPriority(roomRateModifiers)
    return roomRateModifiers;
}

//given where may be multiple rate modifiers applicable for a given hotel and room, we need to prioritize them
//each rate modifier has a priority number - this function sorts them by the priority
function sortRateModifiersByPriority(rateModifiers: IRateModifierCollection): IRateModifierCollection {
    return rateModifiers.sort((a: IRateModifier, b: IRateModifier) => {
        const pa = a.priority ? a.priority : 0;
        const pb = b.priority ? b.priority : 0;
        return pa - pb;
    })
}


//filter out disabled rate modifiers
function removeInactiveRateModifiers(rateModifiers: IRateModifierCollection): IRateModifierCollection {
    return rateModifiers.filter(rateModifier => rateModifier.enabled)
}

function filterOnlyRoomRateModifiers(rateModifiers: IRateModifierCollection, roomTypeId:string): IRateModifierCollection {
    return rateModifiers.filter(rateModifier => rateModifier.rooms && rateModifier.rooms.includes(roomTypeId))
}



//calculate price of a room offer taking into account all applicable room rate modifiers
async function calculateOfferPrice(hotel: IHotel, room: IRoomType, arrival: string, departure: string, basePrice: number): Promise<number> {
    //get all available rate modifiers for a given hotel and room that can influence price
    const rateModifiers: Array<IRateModifier> = await getHotelAndRoomRateModifiers(hotel.id, room.id);

    const stayDates: Array<Date> = enumerateDaysBetweenDates(arrival, departure)
    const arrivalDate = moment.utc(arrival).clone().toDate();
    const departureDate = moment.utc(departure).clone().toDate();
    let totalPrice = 0
    //iterate over days of stay
    stayDates.forEach((date: Date) => {
        let dayPrice = basePrice;
        // and check if there are any rate modifiers applicable for a given day
        rateModifiers.forEach(rateModifier => {

            //if there are applicable rate modifiers (meaning the condition is met) - calculate price for a given day
            if (isRateModifierApplicable(rateModifier, arrivalDate, departureDate, date)) {
                dayPrice = calculatePrice(dayPrice, rateModifier)
                console.log(`Calculated room price, room:${room.type}, base rate:${basePrice}, calculated:${dayPrice}, rateModifier:`, rateModifier.type)
            }
        })
        //add calculated price to the total
        totalPrice += dayPrice;
    })
    return totalPrice
}

//returns TRUE if a given rate modifier is applicable for a given search criteria and night of stay
function isRateModifierApplicable(rateModifier: IRateModifier, arrival: Date, departure: Date, dayOfStay: Date) {
    const condition = rateModifier.condition ? rateModifier.condition : {};
    const stayDateMoment = moment.utc(dayOfStay);

    if (rateModifier.criteriaType === IRateModifierConditionType.DAY_OF_WEEK) {
        const stayDayOfWeek = stayDateMoment.day();
        switch (stayDayOfWeek) {
            case 0:
                return condition.sunday === true;
            case 1:
                return condition.monday === true;
            case 2:
                return condition.tuesday === true;
            case 3:
                return condition.wednesday === true;
            case 4:
                return condition.thursday === true;
            case 5:
                return condition.friday === true;
            case 6:
                return condition.saturday === true;
        }
    }
    if (rateModifier.criteriaType === IRateModifierConditionType.DATE_RANGE) {
        if (condition.startDate) {
            const conditionStartDate = moment.utc(condition.startDate);
            //criteria start date must be before current day - if it's not, return false
            if (!conditionStartDate.isSameOrBefore(stayDateMoment, 'day')) {
                return false;
            }
        }
        if (condition.endDate) {
            const conditionEndDate = moment.utc(condition.endDate);
            //criteria end date must be after current day - if it's not, return false
            if (!conditionEndDate.isSameOrAfter(stayDateMoment, 'day')) {
                return false;
            }
        }
        return true;
    }
    if (rateModifier.criteriaType === IRateModifierConditionType.LENGTH_OF_STAY) {
        const arrivalDateMoment = moment.utc(arrival);
        const departureDateMoment = moment.utc(departure);
        const durationInDays = departureDateMoment.diff(arrivalDateMoment, 'days')
        if (condition.minStay && condition.minStay >= 0) {
            //stay duration cannot be shorter than minStay
            if (durationInDays < condition.minStay) {
                return false;
            }
        }
        if (condition.maxStay && condition.maxStay >= 0) {
            //stay duration cannot be longer than maxStay
            if (condition.maxStay < durationInDays) {
                return false;
            }
        }
        return true;
    }
    return false;
}

//calculate new price using specific rate modifier
function calculatePrice(baseRate: number, rateModifier: IRateModifier) {
    let newPrice = baseRate;
    if (rateModifier.priceModifierType === 'percentage') {
        const percentage = rateModifier.priceModifierAmount;
        newPrice = baseRate + (baseRate * percentage) / 100;
    } else if (rateModifier.priceModifierType === 'absolute') {
        const amount = Number(rateModifier.priceModifierAmount);
        newPrice = baseRate + amount;
    } else {
        console.warn('Unknown rate modifier type:', rateModifier.priceModifierType)
        throw new CError(HTTP_STATUS.BAD_GATEWAY, `Unknown priceModifierType: ${rateModifier.priceModifierType}`)
    }
    return newPrice;
}

function enumerateDaysBetweenDates(startDate: string, endDate: string): Array<Date> {
    const currDate = moment.utc(startDate).startOf('day')
    const lastDate = moment.utc(endDate).startOf('day')

    const dates = [currDate.clone().toDate()]

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate())
    }

    return dates
}

export { calculateOfferPrice }
