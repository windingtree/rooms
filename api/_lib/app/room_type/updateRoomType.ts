import { HotelRepo } from '../../data/hotel/HotelRepo'
import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IRoomType, IPatchRoomTypePayload } from '../../common/types'

import { roleCanTakeActionOnRoomType } from './_helpers'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { MANAGER, OWNER } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const roomTypeRepo = new RoomTypeRepo()

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  await roleCanTakeActionOnRoomType(requester, roomTypeId, 'update', true, true, false)

  await roomTypeRepo.updateRoomType(roomTypeId, data)
  const roomType = await roomTypeRepo.readRoomType(roomTypeId)

  return roomType
}

export { updateRoomType }
