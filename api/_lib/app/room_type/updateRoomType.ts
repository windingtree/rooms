import { HotelRepo } from '../../data/hotel/HotelRepo'
import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IRoomType, IPatchRoomTypePayload } from '../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN, MANAGER, OWNER, CLERK } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const roomTypeRepo = new RoomTypeRepo()

async function updateRoomType(requester: IProfile, roomTypeId: string, data: IPatchRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === OWNER || requester.role === MANAGER) {
    const roomType = await roomTypeRepo.readRoomType(roomTypeId)
    const hotel = await hotelRepo.readHotel(roomType.hotelId)

    if ((requester.role === OWNER) && (hotel.ownerId !== requester.id)) {
      throw new CError(
        BAD_REQUEST,
        `User with role ${requester.role} is not allowed to update a Room Type for a hotel which he does not own.`
      )
    } else if ((requester.role === MANAGER) && (!hotel.managers.includes(requester.id))) {
      throw new CError(
        BAD_REQUEST,
        `User with role ${requester.role} is not allowed to update a Room Type for a hotel which he does not manage.`
      )
    }
  } else if (requester.role === CLERK) {
    throw new CError(
      BAD_REQUEST,
      `User with role ${requester.role} is not allowed to update a Room Type.`
    )
  }

  await roomTypeRepo.updateRoomType(roomTypeId, data)
  const roomType = await roomTypeRepo.readRoomType(roomTypeId)

  return roomType
}

export { updateRoomType }
