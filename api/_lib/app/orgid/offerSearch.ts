import { NowRequest } from '@vercel/node'

import { readHotelsByLocationRectangle as readHotelsByLocationRectangleDbFunc } from '../../../_lib/data/hotel'
import { readRoomTypes as readRoomTypesDbFunc } from '../../../_lib/data/room_type'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import {
  IHotelCollection,
  IRoomTypeCollection,
  IOfferSearchResults
} from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function offerSearch(request: NowRequest): Promise<IOfferSearchResults> {
  console.log('request.body')
  console.log(JSON.stringify(request.body))
  console.log('')

  let searchLocation
  if (request && request.body && request.body.accommodation && request.body.accommodation.location) {
    searchLocation = request.body.accommodation.location
  } else {
    throw new CError(BAD_REQUEST, 'Property "request.body.accommodation.location" is not defined.')
  }

  if (!searchLocation || !searchLocation.rectangle) {
    throw new CError(BAD_REQUEST, 'The search API supports only "location.rectangle" at this time.')
  }

  const hotels: IHotelCollection = await readHotelsByLocationRectangleDbFunc(searchLocation.rectangle)
  const roomTypes: IRoomTypeCollection = await readRoomTypesDbFunc()

  const result: IOfferSearchResults = {
    accommodations: {},
    "pricePlans": {
      "BAR": {
        "name": "Winding Tree BAR",
        "penalties": {
          "refund": {
            "refundable": true
          }
        }
      }
    },
    offers: {},
    passengers: {
      "PAX1": {
        "type": "ADT"
      }
    }
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
      return
    }

    let hotelMedia: Array<{ type: string, url: string }> = []
    if (typeof hotel.imageUrl === 'string' && hotel.imageUrl.length > 0) {
      hotelMedia = [{
        "type": "photo",
        "url": hotel.imageUrl,
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
        "name": roomType.type,
        "description": 'Room provided by Rooms project.',
        "amenities": roomType.amenities.split(';'),
        "size": {
          "value": "",
          "_unit_": ""
        },
        "maximumOccupancy": {
          "adults": "2",
          "childs": "1"
        },
        "media": roomTypeMedia,
        "policies": {}
      }
    })
  })

  roomTypes.forEach((roomType) => {
    hotels.forEach((hotel) => {

      result.offers[`${hotel.id}-${roomType.id}`] = {
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

    })
  })

  return result
}

export {
  offerSearch,
}
