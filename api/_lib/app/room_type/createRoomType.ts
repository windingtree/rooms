import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IRoomType, IBaseRoomType, IPostRoomTypePayload } from '../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const roomTypeRepo = new RoomTypeRepo()

async function createRoomType(requester: IProfile, payload: IPostRoomTypePayload): Promise<IRoomType> {
  // TODO: Need to verify things in `payload`, and also implement logic based on roles.

  if (
    (requester.role !== SUPER_ADMIN) &&
    (requester.hotelId !== payload.hotelId)
  ) {
    throw new CError(
      BAD_REQUEST,
      `User with role ${requester.role} is not allowed to create a Room Type for a hotel which is not his.`
    )
  }

  const baseRoomType: IBaseRoomType = {
    hotelId: payload.hotelId,
    type: (typeof payload.type !== 'undefined') ? payload.type : '',
    description: (typeof payload.description !== 'undefined') ? payload.description : '',
    quantity: (typeof payload.quantity !== 'undefined') ? payload.quantity : 0,
    price: (typeof payload.price !== 'undefined') ? payload.price : 0,
    devConPrice: (typeof payload.devConPrice !== 'undefined') ? payload.devConPrice : 0,
    amenities: (typeof payload.amenities !== 'undefined') ? payload.amenities : '',
    imageUrl: (typeof payload.imageUrl !== 'undefined') ? payload.imageUrl : '',
  }
  const roomTypeId: string = await roomTypeRepo.createRoomType(baseRoomType)
  const roomType: IRoomType = Object.assign({}, baseRoomType, { id: roomTypeId })

  return roomType
}

export { createRoomType }
