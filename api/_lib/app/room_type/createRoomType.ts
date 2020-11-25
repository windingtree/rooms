import { roomTypeMapper, createRoomType as createRoomTypeRecord, readRoomType as readRoomTypeDbFunc } from '../../../_lib/data/room_type'
import { IProfile, IRoomType, IBaseRoomType, IRoomTypeDbRecord, IPostRoomTypePayload } from '../../../_lib/types'

async function createRoomType(requester: IProfile, payload: IPostRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to verify things in `payload`, and also implement logic based on roles.

  const data: IBaseRoomType = {
    ownerId: payload.ownerId,
    hotelId: payload.hotelId,
    type: (typeof payload.type !== 'undefined') ? payload.type : '',
    quantity: (typeof payload.quantity !== 'undefined') ? payload.quantity : 0,
    price: (typeof payload.price !== 'undefined') ? payload.price : 0,
    amenities: (typeof payload.amenities !== 'undefined') ? payload.amenities : '',
  }
  const roomTypeId: string = await createRoomTypeRecord(data)

  const roomTypeDbRecord: IRoomTypeDbRecord = await readRoomTypeDbFunc(roomTypeId)
  const roomType: IRoomType = roomTypeMapper(roomTypeDbRecord)

  return roomType
}

export {
  createRoomType,
}
