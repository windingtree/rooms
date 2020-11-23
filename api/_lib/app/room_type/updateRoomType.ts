import {
  roomTypeMapper,
  updateRoomType as updateRoomTypeDbFunc,
  updateRoomTypeByOwnerId as updateRoomTypeByOwnerIdDbFunc,
  readRoomType,
  readRoomTypeByOwnerId
} from '../../../_lib/data/room_type'
import { IProfile, IRoomType, IPatchRoomTypePayload, IRoomTypeDbRecord } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  let roomTypeDbRecord: IRoomTypeDbRecord

  if (requester.role === SUPER_ADMIN) {
    await updateRoomTypeDbFunc(roomTypeId, data)
    roomTypeDbRecord = await readRoomType(roomTypeId)
  } else {
    await updateRoomTypeByOwnerIdDbFunc(roomTypeId, requester.id, data)
    roomTypeDbRecord = await readRoomTypeByOwnerId(roomTypeId, requester.id)
  }

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  updateRoomType,
}
