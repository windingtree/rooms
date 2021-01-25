import { HotelRepo } from '../../../data/hotel/HotelRepo'
import { RoomTypeRepo } from '../../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IProfile } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { MANAGER, OWNER, CLERK } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const roomTypeRepo = new RoomTypeRepo()

async function roleCanTakeActionOnRoomType(
  requester: IProfile,
  roomTypeId: string,
  action: string,
  checkOwner: boolean,
  checkManager: boolean,
  checkClerk: boolean
): Promise<void> {
  let errMsg = `Users with role ${requester.role} are not allowed ` +
    `to perform '${action}' operation on a Room Type for a hotel which `
  let throwErr = false

  if (requester.role === OWNER || requester.role === MANAGER || requester.role === CLERK) {
    const roomType = await roomTypeRepo.readRoomType(roomTypeId)
    const hotel = await hotelRepo.readHotel(roomType.hotelId)

    if ((checkOwner) && (requester.role === OWNER) && (hotel.ownerId !== requester.id)) {
      errMsg += 'they do not own.'
      throwErr = true
    } else if ((checkManager) && (requester.role === MANAGER) && (!hotel.managers.includes(requester.id))) {
      errMsg += 'they do not manage.'
      throwErr = true
    } else if ((checkClerk) && (requester.role === CLERK) && (!hotel.clerks.includes(requester.id))) {
      errMsg += 'they are not a clerk of.'
      throwErr = true
    }
  }

  if (throwErr === true) {
    throw new CError(BAD_REQUEST, errMsg)
  }
}

export { roleCanTakeActionOnRoomType }
