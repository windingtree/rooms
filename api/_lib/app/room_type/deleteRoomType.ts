import {
  deleteRoomType as deleteRoomTypeDbFunc,
  deleteRoomTypeByOwnerId as deleteRoomTypeByOwnerIdDbFunc
} from '../../../_lib/data/room_type'
import { IProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function deleteRoomType(requester: IProfile, roomTypeId: string): Promise<void> {
  if (requester.role === SUPER_ADMIN) {
    await deleteRoomTypeDbFunc(roomTypeId)
  } else {
    await deleteRoomTypeByOwnerIdDbFunc(roomTypeId, requester.id)
  }
}

export {
  deleteRoomType,
}
