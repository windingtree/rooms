import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseHotelDbData,
  IHotelDbData,
  IHotelCollectionDbData,
  IPatchHotelPayloadDbData,

  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPatchHotelPayload,

  IHotelLocation,
} from '../../../_lib/types'

class Mapper {
  fromBaseEntity(baseHotel: IBaseHotel): IBaseHotelDbData {
    return {
      ownerId: getObjectId(baseHotel.ownerId),
      name: baseHotel.name,
      description: baseHotel.description,
      address: baseHotel.address,
      location: {
        type: 'Point',
        coordinates: [
          (baseHotel.location as IHotelLocation).lat,
          (baseHotel.location as IHotelLocation).lng,
        ]
      },
      imageUrl: baseHotel.imageUrl,
      email: baseHotel.email,
    }
  }

  fromPatchEntityPayload(patchHotelPayload: IPatchHotelPayload): IPatchHotelPayloadDbData {
    const patchHotelPayloadDbData: IPatchHotelPayloadDbData = {}
    let prop: keyof IPatchHotelPayload

    prop = 'ownerId'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = getObjectId(patchHotelPayload[prop])
    }

    prop = 'name'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
    }

    prop = 'description'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
    }

    prop = 'address'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
    }

    prop = 'location'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = {
        type: 'Point',
        coordinates: [
          (patchHotelPayload[prop] as IHotelLocation).lat,
          (patchHotelPayload[prop] as IHotelLocation).lng,
        ]
      }
    }

    prop = 'imageUrl'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
    }

    prop = 'email'
    if (typeof patchHotelPayload[prop] !== 'undefined') {
      patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
    }

    return patchHotelPayloadDbData
  }

  toEntity(hotelDbData: IHotelDbData): IHotel {
    return {
      id: getObjectIdString(hotelDbData._id),
      ownerId: getObjectIdString(hotelDbData.ownerId),
      name: hotelDbData.name,
      description: hotelDbData.description,
      address: hotelDbData.address,
      location: {
        lat: hotelDbData.location.coordinates[0],
        lng: hotelDbData.location.coordinates[1],
      },
      imageUrl: hotelDbData.imageUrl,
      email: hotelDbData.email,
    }
  }

  toEntityCollection(hotelCollectionDbData: IHotelCollectionDbData): IHotelCollection {
    const hotels: IHotelCollection = []

    hotelCollectionDbData.forEach((hotelDbData: IHotelDbData) => {
      hotels.push(this.toEntity(hotelDbData))
    })

    return hotels
  }
}

const mapper = new Mapper()

export {
  mapper,
}
