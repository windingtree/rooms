import {
  deleteRoomType as deleteRoomTypeDbFunc
} from '../../../_lib/data/room_type'
import { IProfile } from '../../../_lib/types'

async function deleteRoomType(requester: IProfile, roomTypeId: string): Promise<void> {
  // TODO: Need to implement logic based on roles.

  await deleteRoomTypeDbFunc(roomTypeId)
}

export {
  deleteRoomType,
}
