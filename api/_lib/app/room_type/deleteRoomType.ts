import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IStatus } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const roomTypeRepo = new RoomTypeRepo()

async function deleteRoomType(requester: IProfile, roomTypeId: string): Promise<IStatus> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === SUPER_ADMIN) {
    await roomTypeRepo.deleteRoomType(roomTypeId)
  } else {
    await roomTypeRepo.deleteRoomTypeByHotelId(roomTypeId, requester.hotelId)
  }

  return { status: 'OK' }
}

export { deleteRoomType }
