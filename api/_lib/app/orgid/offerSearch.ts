// node/npm imports
import { NowRequest } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

// data layer imports
import { HotelRepo } from '../../data/hotel/HotelRepo'
import { OfferRepo } from '../../data/offer/OfferRepo'
import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import {
  IHotelCollection,
  IRoomTypeCollection,
  IOfferSearchResults,
  IBaseOfferCollection,
  ILocationRectangle,
  ILocationRectangleDbType,
  IOrgDetails,
} from '../../common/types'

const moment = extendMoment(Moment)

const { BAD_REQUEST, NOT_FOUND } = CONSTANTS.HTTP_STATUS

const hotelRepo = new HotelRepo()
const offerRepo = new OfferRepo()
const roomTypeRepo = new RoomTypeRepo()

async function convertToNum(val: number|string|null|undefined): Promise<number> {
  let num: number

  if (typeof val === 'number') {
    num = val
  } else if (typeof val === 'string' && !Number.isNaN(parseFloat(val))) {
    num = parseFloat(val)
  } else {
    throw new CError(BAD_REQUEST, `Could not convert value '${val}' to a number.`)
  }

  return num
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

function calculateTotalPrice(price: number, devConPrice: number, arrival: string, departure: string): number {
  const devConStartDate = moment.utc('2021-08-10T00:00:00+00:00')
  const devConStopDate = moment.utc('2021-08-13T23:59:59+00:00')

  const devConDateRange = moment.range(devConStartDate, devConStopDate)

  const stayDates: Array<Date> = enumerateDaysBetweenDates(arrival, departure)

  let totalPrice = 0

  stayDates.forEach((date: Date) => {
    if (devConDateRange.contains(date)) {
      totalPrice += devConPrice
    } else {
      totalPrice += price
    }
  })

  return totalPrice
}

async function offerSearch(request: NowRequest, requester: IOrgDetails): Promise<IOfferSearchResults> {
  let searchLocation
  if (request && request.body && request.body.accommodation && request.body.accommodation.location) {
    searchLocation = request.body.accommodation.location
  } else {
    throw new CError(BAD_REQUEST, 'Property "request.body.accommodation.location" is not defined.')
  }

  if (!searchLocation || !searchLocation.rectangle) {
    throw new CError(BAD_REQUEST, 'The search API supports only "location.rectangle" at this time.')
  }

  if (!request.body || !request.body.accommodation || typeof request.body.accommodation.arrival !== 'string') {
    throw new CError(BAD_REQUEST, 'Must provide "accommodation.arrival" property. It should be of type "string".')
  }
  const arrival: string = request.body.accommodation.arrival
  if (!moment.utc(arrival).isValid()) {
    throw new CError(BAD_REQUEST, 'The "accommodation.arrival" date is not avalid date string.')
  }

  if (!request.body || !request.body.accommodation || typeof request.body.accommodation.departure !== 'string') {
    throw new CError(BAD_REQUEST, 'Must provide "accommodation.departure" property. It should be of type "string".')
  }
  const departure: string = request.body.accommodation.departure
  if (!moment.utc(departure).isValid()) {
    throw new CError(BAD_REQUEST, 'The "accommodation.departure" date is not avalid date string.')
  }

  const rectangle: ILocationRectangle = searchLocation.rectangle
  const rectangleDb: ILocationRectangleDbType = {
    north: await convertToNum(rectangle.north),
    south: await convertToNum(rectangle.south),
    west: await convertToNum(rectangle.west),
    east: await convertToNum(rectangle.east),
  }

  const hotels: IHotelCollection = await hotelRepo.readHotelsByLocationRectangle(rectangleDb)
  if (hotels.length === 0) {
    throw new CError(NOT_FOUND, 'No hotels were found within the specified geo region.', { rectangleDb })
  }

  const roomTypes: IRoomTypeCollection = await roomTypeRepo.readRoomTypes()

  const result: IOfferSearchResults = {
    accommodations: {},
    pricePlans: {
      BAR: {
        name: 'Winding Tree BAR',
        penalties: {
          refund: {
            refundable: true,
          },
        },
      },
    },
    offers: {},
    passengers: {
      PAX1: {
        type: 'ADT',
      },
    },
  }

  hotels.forEach((hotel) => {
    let numAvailRoomTypes = 0

    roomTypes.forEach((roomType) => {
      if (roomType.hotelId !== hotel.id) {
        return
      }

      numAvailRoomTypes += 1
    })

    if (numAvailRoomTypes === 0) {
      throw new CError(NOT_FOUND, 'No available rooms found for selected hotels.')
    }

    let hotelMedia: Array<{ type: string, url: string }> = []
    if (typeof hotel.imageUrl === 'string' && hotel.imageUrl.length > 0) {
      hotelMedia = [{
        type: 'photo',
        url: hotel.imageUrl,
      }]
    }

    result.accommodations[hotel.id] = {
      name: hotel.name,
      type: 'hotel',
      description: hotel.description,
      location: {
        coordinates: {
          latitude: hotel.location.lat,
          longitude: hotel.location.lng,
        },
      },
      rating: 5,
      contactInformation: {
        phoneNumbers: [],
        emails: [],
        address: {
          streetAddress: hotel.address,
          premise: '',
          locality: '',
          postalCode: '',
          country: '',
        },
      },
      checkinoutPolicy: {
        checkinTime: "15:00",
        checkoutTime: "24:00",
      },
      otherPolicies: {},
      media: hotelMedia,
      roomTypes: {},
    }

    roomTypes.forEach((roomType) => {
      if (roomType.hotelId !== hotel.id) {
        return
      }

      let roomTypeMedia: Array<{ type: string, url: string }> = []
      if (typeof roomType.imageUrl === 'string' && roomType.imageUrl.length > 0) {
        roomTypeMedia = [{
          "type": "photo",
          "url": roomType.imageUrl,
        }]
      }

      result.accommodations[hotel.id].roomTypes[roomType.id] = {
        name: roomType.type,
        description: roomType.description,
        amenities: roomType.amenities
          .split(';')
          .map((amenity) => {
            return amenity.trim()
          })
          .filter((amenity) => {
            return amenity !== ''
          }),
        size: {
          value: '',
          unit: 'metric',
        },
        maximumOccupancy: {
          adults: 2,
          childs: 1,
        },
        media: roomTypeMedia,
        policies: {},
      }
    })
  })

  const cachedBaseOffers: IBaseOfferCollection = []
  const createdAt = moment.utc(new Date())

  roomTypes.forEach((roomType) => {
    hotels.forEach((hotel) => {
      if (roomType.hotelId !== hotel.id) {
        return
      }

      let price = 0
      if (typeof roomType.price === 'number' && roomType.price > 0) {
        price = roomType.price
      }

      let devConPrice = 0
      if (typeof roomType.devConPrice === 'number' && roomType.devConPrice > 0) {
        devConPrice = roomType.devConPrice
      }

      if (devConPrice === 0) {
        devConPrice = price
      }

      const offerId = uuidv4()
      const offer = {
        pricePlansReferences: {
          BAR: {
            accommodation: hotel.id,
            roomType: roomType.id,
          },
        },
        price: {
          currency: 'USD',
          public: calculateTotalPrice(price, devConPrice, arrival, departure),
          taxes: 0,
        },
      }

      result.offers[offerId] = offer
      cachedBaseOffers.push({
        arrival,
        departure,
        offerId,
        offer,
        createdAt: createdAt.format(),
        debtorOrgId: requester.organization.id,
        hotelEmail: hotel.email,
      })
    })
  })

  if (cachedBaseOffers.length > 0) {
    await offerRepo.createOffers(cachedBaseOffers)
  }

  return result
}

export {
  offerSearch,
}
