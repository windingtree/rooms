import { readHotels as readHotelsDbFunc } from '../../../_lib/data/hotel'
import { readRoomTypes as readRoomTypesDbFunc } from '../../../_lib/data/room_type'
import {
  IHotelCollection,
  IRoomTypeCollection,
  IOfferSearchResults
} from '../../../_lib/types'

async function offerSearch(): Promise<IOfferSearchResults> {
  const roomTypes: IRoomTypeCollection = await readRoomTypesDbFunc()
  const hotels: IHotelCollection = await readHotelsDbFunc()

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

    roomTypes.forEach((roomType) => {
      if (roomType.hotelId !== hotel.id) {
        return
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
        "media": [{
          "type": "photo",
          "url": roomType.imageUrl,
        }],
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
          currency: 'EUR',
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
