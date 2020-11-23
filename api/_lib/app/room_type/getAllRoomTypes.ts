import { roomTypeCollectionMapper, readRoomTypes, readRoomTypesByOwnerId } from '../../../_lib/data/room_type'
import { IProfile, IRoomTypeCollection, IRoomTypeDbRecordCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getAllRoomTypes(requester: IProfile): Promise<IRoomTypeCollection> {
  let roomTypeDbRecordCollection: IRoomTypeDbRecordCollection

  if (requester.role === SUPER_ADMIN) {
    roomTypeDbRecordCollection = await readRoomTypes()
  } else {
    roomTypeDbRecordCollection = await readRoomTypesByOwnerId(requester.id)
  }

  return roomTypeCollectionMapper(roomTypeDbRecordCollection)
}

export {
  getAllRoomTypes,
}
