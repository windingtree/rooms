import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IRoomTypeCollection } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const roomTypeRepo = new RoomTypeRepo()

async function getAllRoomTypes(requester: IProfile): Promise<IRoomTypeCollection> {
  // TODO: Need to implement logic based on roles.

  let roomTypeCollection: IRoomTypeCollection

  if (requester.role === SUPER_ADMIN) {
    roomTypeCollection = await roomTypeRepo.readRoomTypes()
  } else {
    roomTypeCollection = await roomTypeRepo.readRoomTypesByHotelId(requester.hotelId)
  }

  return roomTypeCollection
}

export { getAllRoomTypes }
