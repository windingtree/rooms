import { roomTypeCollectionMapper, readRoomTypes } from '../../../_lib/data/room_type'
import { IProfile, IRoomTypeCollection, IRoomTypeDbRecordCollection } from '../../../_lib/types'

async function getAllRoomTypes(requester: IProfile): Promise<IRoomTypeCollection> {
  // TODO: Need to implement logic based on roles.

  const roomTypeDbRecordCollection: IRoomTypeDbRecordCollection = await readRoomTypes()

  return roomTypeCollectionMapper(roomTypeDbRecordCollection)
}

export {
  getAllRoomTypes,
}
