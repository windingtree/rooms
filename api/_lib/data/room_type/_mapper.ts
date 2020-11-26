import { getObjectIdString } from '../../../_lib/tools'
import { IRoomTypeDbRecord, IRoomType, IRoomTypeDbRecordCollection, IRoomTypeCollection } from '../../../_lib/types'

function roomTypeMapper(roomTypeDbRecord: IRoomTypeDbRecord): IRoomType {
  const roomType: IRoomType = {
    id: getObjectIdString(roomTypeDbRecord._id),
    hotelId: getObjectIdString(roomTypeDbRecord.hotelId),
    type: roomTypeDbRecord.type,
    quantity: roomTypeDbRecord.quantity,
    price: roomTypeDbRecord.price,
    amenities: roomTypeDbRecord.amenities,
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
  roomTypeMapper,
  roomTypeCollectionMapper,
}
