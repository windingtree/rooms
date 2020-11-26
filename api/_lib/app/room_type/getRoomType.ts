import {
  readRoomType as readRoomTypeDbFunc,
  readRoomTypeByHotelId as readRoomTypeByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomType,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getRoomType(requester: IProfile, roomTypeId: string): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomType: IRoomType

  if (requester.role === SUPER_ADMIN) {
    roomType = await readRoomTypeDbFunc(roomTypeId)
  } else {
    roomType = await readRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId)
  }

  return roomType
}

export {
  getRoomType,
}
