import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import {
    IHotel, IRateModifier,
    IRateModifierCollection, IRateModifierConditionType, IRoomType
} from '../../common/types'

const moment = extendMoment(Moment)

const repository = new RateModifierRepo()
const hotelRateModifiersCache = new Map<string, IRateModifierCollection>()

async function getHotelAndRoomRateModifiers(hotelId: string, roomTypeId: string): Promise<IRateModifierCollection> {
    if (hotelRateModifiersCache.has(hotelId)) {
        const rateModifiers: IRateModifierCollection | undefined = hotelRateModifiersCache.get(hotelId);
        return rateModifiers ? rateModifiers : [];
    }
    //TODO filter by roomTypeId too
    let hotelRateModifiers: IRateModifierCollection = await repository.getRateModifiersByHotelId(hotelId);
    if (!hotelRateModifiers)
        {hotelRateModifiers = [];}
    hotelRateModifiers = removeInactiveRateModifiers(hotelRateModifiers)
    hotelRateModifiers = sortRateModifiersByPriority(hotelRateModifiers)
    hotelRateModifiersCache.set(hotelId, hotelRateModifiers);
    return hotelRateModifiers;
}

function sortRateModifiersByPriority(rateModifiers: IRateModifierCollection):IRateModifierCollection{
    return rateModifiers.sort((a:IRateModifier,b:IRateModifier)=>{
        const pa=a.priority?a.priority:0;
        const pb=b.priority?b.priority:0;
        return pa-pb;
    })
}

function removeInactiveRateModifiers(rateModifiers: IRateModifierCollection):IRateModifierCollection{
    return rateModifiers.filter(rateModifier=>rateModifier.enabled)
}
async function calculateOfferPrice(hotel: IHotel, room: IRoomType, arrival: string, departure: string, basePrice: number): Promise<number> {
    //get all available rate modifiers for a given hotel and room that can influence price
    const rateModifiers:Array<IRateModifier> = await getHotelAndRoomRateModifiers(hotel.id,room.id);

    const stayDates: Array<Date> = enumerateDaysBetweenDates(arrival, departure)
    const arrivalDate = moment.utc(arrival).clone().toDate();
    const departureDate = moment.utc(departure).clone().toDate();
    let totalPrice = 0
    //iterate over days of stay
    stayDates.forEach((date: Date) => {
        let dayPrice = basePrice;
        // and check if there are any rate modifiers applicable for a given day
        rateModifiers.forEach(rateModifier=>{

            //if there are applicable rate modifiers (meaning the condition is met) - calculate price for a given day
            if(isRateModifierApplicable(rateModifier,arrivalDate,departureDate,date)){
                dayPrice = calculatePrice(dayPrice, rateModifier)
                console.log(`Base rate:${basePrice}, calculated:${dayPrice}, rateModifier:`, rateModifier.type)
            }
        })
        //add calculated price to the total
        totalPrice+=dayPrice;
    })
    return totalPrice
}

function isRateModifierApplicable(rateModifier: IRateModifier, arrival:Date, departure:Date, dayOfStay: Date){
    const condition = rateModifier.condition?rateModifier.condition:{};
    const stayDateMoment = moment.utc(dayOfStay);

    if(rateModifier.criteriaType === IRateModifierConditionType.DAY_OF_WEEK){
        const stayDayOfWeek = stayDateMoment.day();
        switch(stayDayOfWeek){
            case 0:
                return condition.sunday===true;
            case 1:
                return condition.monday===true;
            case 2:
                return condition.tuesday===true;
            case 3:
                return condition.wednesday===true;
            case 4:
                return condition.thursday===true;
            case 5:
                return condition.friday===true;
            case 6:
                return condition.saturday===true;
        }
    }
    if(rateModifier.criteriaType === IRateModifierConditionType.DATE_RANGE){
        if(condition.startDate){
            const conditionStartDate = moment.utc(condition.startDate);
            //criteria start date must be before current day - if it's not, return false
            if(!conditionStartDate.isSameOrBefore(stayDateMoment,'day'))
                {return false;}
        }
        if(condition.endDate){
            const conditionEndDate = moment.utc(condition.endDate);
            //criteria end date must be after current day - if it's not, return false
            if(!conditionEndDate.isSameOrAfter(stayDateMoment,'day'))
                {return false;}
        }
        return true;
    }
    if(rateModifier.criteriaType === IRateModifierConditionType.LENGTH_OF_STAY) {
        const arrivalDateMoment = moment.utc(arrival);
        const departureDateMoment = moment.utc(departure);
        const durationInDays = departureDateMoment.diff(arrivalDateMoment,'days')
        if(condition.minStay && condition.minStay>=0){
            //stay duration cannot be shorter than minStay
            if(durationInDays<condition.minStay)
                {return false;}
        }
        if(condition.maxStay && condition.maxStay>=0){
            //stay duration cannot be longer than maxStay
            if(condition.maxStay<durationInDays)
                {return false;}
        }
        return true;
    }
    return false;
}

function calculatePrice(baseRate: number, rateModifier: IRateModifier){
    let newPrice = baseRate;
    if(rateModifier.priceModifierType === 'percentage'){
        const percentage = rateModifier.priceModifierAmount;
        newPrice=baseRate+(baseRate*percentage)/100;
    }else
    if(rateModifier.priceModifierType === 'absolute'){
        const amount = Number(rateModifier.priceModifierAmount);
        newPrice=baseRate+amount;
    }else{
        console.log('Unknown rate modifier type:',rateModifier.priceModifierType)
    }
    console.log('Price before:', baseRate, ' Price after:', newPrice)
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
