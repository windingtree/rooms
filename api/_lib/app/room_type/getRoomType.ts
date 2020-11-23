import { roomTypeMapper, readRoomType, readRoomTypeByOwnerId } from '../../../_lib/data/room_type'
import { IProfile, IRoomType, IRoomTypeDbRecord } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getRoomType(requester: IProfile, roomTypeId: string): Promise<IRoomType> {
  let roomTypeDbRecord: IRoomTypeDbRecord

  if (requester.role === SUPER_ADMIN) {
    roomTypeDbRecord = await readRoomType(roomTypeId)
  } else {
    roomTypeDbRecord = await readRoomTypeByOwnerId(roomTypeId, requester.id)
  }

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  getRoomType,
}
