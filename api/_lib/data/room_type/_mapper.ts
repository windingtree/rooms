import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseRoomTypeDbRecord,
  IRoomTypeDbRecord,
  IRoomTypeDbRecordCollection,
  IPatchRoomTypePayloadDbData,

  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
  IPatchRoomTypePayload,
} from '../../../_lib/types'

function baseRoomTypeDbRecordMapper(baseRoomType: IBaseRoomType): IBaseRoomTypeDbRecord {
  const baseRoomTypeDbRecord: IBaseRoomTypeDbRecord = {
    hotelId: getObjectId(baseRoomType.hotelId),
    type: baseRoomType.type,
    quantity: baseRoomType.quantity,
    price: baseRoomType.price,
    amenities: baseRoomType.amenities,
    imageUrl: baseRoomType.imageUrl,
  }

  return baseRoomTypeDbRecord
}

function patchRoomTypePayloadDbDataMapper(patchRoomTypePayload: IPatchRoomTypePayload): IPatchRoomTypePayloadDbData {
  const patchRoomTypePayloadDbData: IPatchRoomTypePayloadDbData = {}
  let prop: keyof IPatchRoomTypePayload

  prop = 'hotelId'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = getObjectId(patchRoomTypePayload[prop])
  }

  prop = 'type'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
  }

  prop = 'quantity'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
  }

  prop = 'price'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
  }

  prop = 'amenities'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
  }

  prop = 'imageUrl'
  if (typeof patchRoomTypePayload[prop] !== 'undefined') {
    patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
  }

  return patchRoomTypePayloadDbData
}

function roomTypeMapper(roomTypeDbRecord: IRoomTypeDbRecord): IRoomType {
  const roomType: IRoomType = {
    id: getObjectIdString(roomTypeDbRecord._id),
    hotelId: getObjectIdString(roomTypeDbRecord.hotelId),
    type: roomTypeDbRecord.type,
    quantity: roomTypeDbRecord.quantity,
    price: roomTypeDbRecord.price,
    amenities: roomTypeDbRecord.amenities,
    imageUrl: roomTypeDbRecord.imageUrl,
  }

  return roomType
}

function roomTypeCollectionMapper(roomTypeDbRecordCollection: IRoomTypeDbRecordCollection): IRoomTypeCollection {
  const roomTypes: IRoomTypeCollection = []
  roomTypeDbRecordCollection.forEach((roomTypeDbRecord) => {
    roomTypes.push(roomTypeMapper(roomTypeDbRecord))
  })

  return roomTypes
}

export {
  baseRoomTypeDbRecordMapper,
  patchRoomTypePayloadDbDataMapper,
  roomTypeMapper,
  roomTypeCollectionMapper,
}
