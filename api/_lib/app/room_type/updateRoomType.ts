import {
  roomTypeMapper,
  updateRoomType as updateRoomTypeDbFunc,
  readRoomType,
} from '../../../_lib/data/room_type'
import { IProfile, IRoomType, IPatchRoomTypePayload, IRoomTypeDbRecord } from '../../../_lib/types'

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  await updateRoomTypeDbFunc(roomTypeId, data)
  const roomTypeDbRecord: IRoomTypeDbRecord = await readRoomType(roomTypeId)

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  updateRoomType,
}
