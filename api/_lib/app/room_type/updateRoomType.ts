import { RoomTypeRepo } from '../../../_lib/data/room_type/RoomTypeRepo'
import {
  IProfile,
  IRoomType,
  IPatchRoomTypePayload,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const roomTypeRepo = new RoomTypeRepo()

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomType: IRoomType

  if (requester.role === SUPER_ADMIN) {
    await roomTypeRepo.updateRoomType(roomTypeId, data)
    roomType = await roomTypeRepo.readRoomType(roomTypeId)
  } else {
    await roomTypeRepo.updateRoomTypeByHotelId(roomTypeId, requester.hotelId, data)
    roomType = await roomTypeRepo.readRoomTypeByHotelId(roomTypeId, requester.hotelId)
  }

  return roomType
}

export {
  updateRoomType,
}
