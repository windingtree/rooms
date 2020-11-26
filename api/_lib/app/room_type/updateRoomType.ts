import {
  updateRoomType as updateRoomTypeDbFunc,
  updateRoomTypeByHotelId as updateRoomTypeByHotelIdDbFunc,
  readRoomType as readRoomTypeDbFunc,
  readRoomTypeByHotelId as readRoomTypeByHotelIdDbFunc,
} from '../../../_lib/data/room_type'
import {
  IProfile,
  IRoomType,
  IPatchRoomTypePayload,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  let roomType: IRoomType

  if (requester.role === SUPER_ADMIN) {
    await updateRoomTypeDbFunc(roomTypeId, data)
    roomType = await readRoomTypeDbFunc(roomTypeId)
  } else {
    await updateRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId, data)
    roomType = await readRoomTypeByHotelIdDbFunc(roomTypeId, requester.hotelId)
  }

  return roomType
}

export {
  updateRoomType,
}
