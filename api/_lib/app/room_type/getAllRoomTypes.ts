import {
  roomTypeCollectionMapper,
  readRoomTypes as readRoomTypesDbFunc,
  readRoomTypesByHotelId as readRoomTypesByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomTypeCollection,
  IRoomTypeDbRecordCollection,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getAllRoomTypes(requester: IProfile): Promise<IRoomTypeCollection> {
  // TODO: Need to implement logic based on roles.

  let roomTypeDbRecordCollection: IRoomTypeDbRecordCollection

  if (requester.role === SUPER_ADMIN) {
    roomTypeDbRecordCollection = await readRoomTypesDbFunc()
  } else {
    roomTypeDbRecordCollection = await readRoomTypesByHotelIdDbFunc(requester.hotelId)
  }

  return roomTypeCollectionMapper(roomTypeDbRecordCollection)
}

export {
  getAllRoomTypes,
}
