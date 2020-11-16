import { NowRequest, NowResponse } from '@vercel/node'
// import { v4 as uuidv4 } from 'uuid'

import { getAllRoomTypes } from '../../_lib/data'
import { readHotels } from '../../_lib/data/hotel'
import { verifyOrgJwt } from '../../_lib/data/marketplace'
import { genericApiMethodHandler, errorHandler, getOrgToken } from '../../_lib/tools'
import { /* IVerifiedOrgJwtResults, */ IRoomTypeCollection, IHotelCollection } from '../../_lib/types'

interface IAccommodationsRoomType {
  [key:string]: unknown
}

interface IAccommodation {
  [key:string]: unknown

  roomTypes: IAccommodationsRoomType
}

interface IAccommodations {
  [key:string]: IAccommodation
}

interface IPricePlans {
  [key:string]: unknown
}

interface IOffers {
  [key:string]: unknown
}

interface IPassengers {
  [key:string]: unknown
}

interface IOfferSearchResults {
  accommodations: IAccommodations
  pricePlans: IPricePlans
  offers: IOffers
  passengers: IPassengers
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  console.log('API request for offers/search')
  console.log('BODY =>')
  console.log(JSON.stringify(request.body))

  let jwt: string
  try {
    jwt = getOrgToken(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  // let verifiedOrgJwtResults: IVerifiedOrgJwtResults
  try {
    // verifiedOrgJwtResults = await verifyOrgJwt(jwt)
    await verifyOrgJwt(jwt)
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

  // const roomCollection = roomTypeCollection.map((roomType) => {
  //   const email = roomType.email
  //   const hotel = profileCollection.find((el) => {
  //     return el.email === email
  //   })

  //   if (!profile) {
  //     return null
  //   }

  //   return {
  //     id: uuidv4(),
  //     type: roomType.type,
  //     price: roomType.price,
  //     hotel: profile.hotelName,
  //     address: profile.hotelAddress,
  //   }
  // }).filter((el) => {
  //   return el !== null
  // })

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
