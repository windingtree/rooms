import { roomTypeMapper, readRoomType } from '../../../_lib/data/room_type'
import { IProfile, IRoomType, IRoomTypeDbRecord } from '../../../_lib/types'

async function getRoomType(requester: IProfile, roomTypeId: string): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  const roomTypeDbRecord: IRoomTypeDbRecord = await readRoomType(roomTypeId)

  return roomTypeMapper(roomTypeDbRecord)
}

export {
  getRoomType,
}
