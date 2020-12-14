import { NowRequest } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import * as moment from 'moment'

import { createOffers } from '../../../_lib/data/offer'
import { readHotelsByLocationRectangle as readHotelsByLocationRectangleDbFunc } from '../../../_lib/data/hotel'
import { readRoomTypes as readRoomTypesDbFunc } from '../../../_lib/data/room_type'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import {
  IHotelCollection,
  IRoomTypeCollection,
  IOfferSearchResults,
  IOfferCollection,
  ILocationRectangle,
  ILocationRectangleDbType,
  IOrgDetails,
} from '../../../_lib/types'

const { BAD_REQUEST, NOT_FOUND } = CONSTANTS.HTTP_STATUS

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

  const hotels: IHotelCollection = await readHotelsByLocationRectangleDbFunc(rectangleDb)
  if (hotels.length === 0) {
    throw new CError(NOT_FOUND, 'No hotels were found within the specified geo region.')
  }

  const roomTypes: IRoomTypeCollection = await readRoomTypesDbFunc()

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
      throw new CError(NOT_FOUND, 'No available roomtypes found for selected hotels.')
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
      description: 'Hotel provided by Rooms project.',
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
        description: 'Room provided by Rooms project.',
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

  const cachedOffers: IOfferCollection = []
  const createdAt = moment.utc(new Date()).format()

  roomTypes.forEach((roomType) => {
    hotels.forEach((hotel) => {
      if (roomType.hotelId !== hotel.id) {
        return
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
          public: roomType.price,
          taxes: 0,
        },
      }

      result.offers[offerId] = offer
      cachedOffers.push({
        id: '',
        arrival,
        departure,
        offerId,
        offer,
        createdAt,
        debtorOrgId: requester.organization.id,
      })
    })
  })

  if (cachedOffers.length > 0) {
    await createOffers(cachedOffers)
  }

  return result
}

export {
  offerSearch,
}
