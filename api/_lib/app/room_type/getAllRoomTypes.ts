import {
  readRoomTypes as readRoomTypesDbFunc,
  readRoomTypesByHotelId as readRoomTypesByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomTypeCollection,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getAllRoomTypes(requester: IProfile): Promise<IRoomTypeCollection> {
  // TODO: Need to implement logic based on roles.

  let roomTypeCollection: IRoomTypeCollection

  if (requester.role === SUPER_ADMIN) {
    roomTypeCollection = await readRoomTypesDbFunc()
  } else {
    roomTypeCollection = await readRoomTypesByHotelIdDbFunc(requester.hotelId)
  }

  return roomTypeCollection
}

export {
  getAllRoomTypes,
}
