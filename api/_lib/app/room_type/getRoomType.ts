import {
  roomTypeMapper,
  readRoomType as readRoomTypeDbFunc,
  readRoomTypeByHotelId as readRoomTypeByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomType,
  IRoomTypeDbRecord,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getRoomType(requester: IProfile, roomTypeId: string): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomTypeDbRecord: IRoomTypeDbRecord

  if (requester.role === SUPER_ADMIN) {
    roomTypeDbRecord = await readRoomTypeDbFunc(roomTypeId)
  } else {
    roomTypeDbRecord = await readRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId)
  }

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  getRoomType,
}
