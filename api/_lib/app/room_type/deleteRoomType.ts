import {
  deleteRoomType as deleteRoomTypeDbFunc,
  deleteRoomTypeByHotelId as deleteRoomTypeByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IStatus,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function deleteRoomType(requester: IProfile, roomTypeId: string): Promise<IStatus> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === SUPER_ADMIN) {
    await deleteRoomTypeDbFunc(roomTypeId)
  } else {
    await deleteRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId)
  }

  return { status: 'OK' }
}

export {
  deleteRoomType,
}
