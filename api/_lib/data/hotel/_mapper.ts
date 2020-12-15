import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseHotelDbRecord,
  IHotelDbRecord,
  IHotelDbRecordCollection,
  IPatchHotelPayloadDbData,

  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPatchHotelPayload,

  IHotelLocation,
} from '../../../_lib/types'

function baseHotelDbRecordMapper(baseHotel: IBaseHotel): IBaseHotelDbRecord {
  const baseHotelDbRecord: IBaseHotelDbRecord = {
    ownerId: getObjectId(baseHotel.ownerId),
    name: baseHotel.name,
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

  return baseHotelDbRecord
}

function patchHotelPayloadDbDataMapper(patchHotelPayload: IPatchHotelPayload): IPatchHotelPayloadDbData {
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

function hotelMapper(hotelDbRecord: IHotelDbRecord): IHotel {
  const hotel: IHotel = {
    id: getObjectIdString(hotelDbRecord._id),
    ownerId: getObjectIdString(hotelDbRecord.ownerId),
    name: hotelDbRecord.name,
    address: hotelDbRecord.address,
    location: {
      lat: hotelDbRecord.location.coordinates[0],
      lng: hotelDbRecord.location.coordinates[1],
    },
    imageUrl: hotelDbRecord.imageUrl,
    email: hotelDbRecord.email,
  }

  return hotel
}

function hotelCollectionMapper(hotelDbRecordCollection: IHotelDbRecordCollection): IHotelCollection {
  const hotels: IHotelCollection = []
  hotelDbRecordCollection.forEach((hotelDbRecord) => {
    hotels.push(hotelMapper(hotelDbRecord))
  })

  return hotels
}

export {
  baseHotelDbRecordMapper,
  patchHotelPayloadDbDataMapper,
  hotelMapper,
  hotelCollectionMapper,
}
