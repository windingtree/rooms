import { NowRequest, NowResponse } from '@vercel/node'

import { getAllRoomTypes } from '../../_lib/data/rooms_legacy'
import { readHotels } from '../../_lib/data/hotel'
import { authenticateOrgIdRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../../_lib/tools'
import { IRoomTypeCollection, IHotelCollection, IOfferSearchResults } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateOrgIdRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomTypeCollection: IRoomTypeCollection
  try {
    roomTypeCollection = await getAllRoomTypes()
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotelCollection: IHotelCollection
  try {
    hotelCollection = await readHotels()
  } catch (err) {
    return errorHandler(response, err)
  }

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

  hotelCollection.forEach((hotel) => {
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
      media: [],
      roomTypes: {},
    }

    roomTypeCollection.forEach((roomType) => {
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
        "media": [],
        "policies": {}
      }
    })
  })

  roomTypeCollection.forEach((roomType) => {
    hotelCollection.forEach((hotel) => {

      result.offers[`${roomType.id}-${hotel.id}`] = {
        pricePlansReferences: {
          BAR: {
            accommodation: hotel.id,
            roomType: roomType.type,
          },
        },
        price: {
          currency: 'EUR',
          public: roomType.price,
          taxes: 0,
        },
      }

    })
  })

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
