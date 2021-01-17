// data layer imports
import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { IProfile, IRoomType } from '../../common/types'

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
