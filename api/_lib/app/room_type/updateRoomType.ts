import {
  roomTypeMapper,
  updateRoomType as updateRoomTypeDbFunc,
  updateRoomTypeByHotelId as updateRoomTypeByHotelIdDbFunc,
  readRoomType as readRoomTypeDbFunc,
  readRoomTypeByHotelId as readRoomTypeByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomType,
  IPatchRoomTypePayload,
  IRoomTypeDbRecord,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomTypeDbRecord: IRoomTypeDbRecord

  if (requester.role === SUPER_ADMIN) {
    await updateRoomTypeDbFunc(roomTypeId, data)
    roomTypeDbRecord = await readRoomTypeDbFunc(roomTypeId)
  } else {
    await updateRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId, data)
    roomTypeDbRecord = await readRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId)
  }

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  updateRoomType,
}
