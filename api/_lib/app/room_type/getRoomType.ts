import { RoomTypeRepo } from '../../../_lib/data/room_type/RoomTypeRepo'
import {
  IProfile,
  IRoomType,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const roomTypeRepo = new RoomTypeRepo()

async function getRoomType(requester: IProfile, roomTypeId: string): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomType: IRoomType

  if (requester.role === SUPER_ADMIN) {
    roomType = await roomTypeRepo.readRoomType(roomTypeId)
  } else {
    roomType = await roomTypeRepo.readRoomTypeByHotelId(roomTypeId, requester.hotelId)
  }

  return roomType
}

export {
  getRoomType,
}
