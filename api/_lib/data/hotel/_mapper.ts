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
} from '../../../_lib/types'

function baseHotelDbRecordMapper(baseHotel: IBaseHotel): IBaseHotelDbRecord {
  const baseHotelDbRecord: IBaseHotelDbRecord = {
    ownerId: getObjectId(baseHotel.ownerId),
    name: baseHotel.name,
    address: baseHotel.address,
    location: baseHotel.location,
    imageUrl: baseHotel.imageUrl,
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
    patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
  }

  prop = 'imageUrl'
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
    location: hotelDbRecord.location,
    imageUrl: hotelDbRecord.imageUrl,
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
