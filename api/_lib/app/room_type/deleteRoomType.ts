import { RoomTypeRepo } from '../../../_lib/data/room_type/RoomTypeRepo'
import {
  IProfile,
  IStatus,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

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

export {
  deleteRoomType,
}
