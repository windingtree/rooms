import {
  createRoomType as createRoomTypeRecord,
  readRoomType as readRoomTypeDbFunc,
} from '../../../_lib/data/room_type'
import {
  CError,
} from '../../../_lib/tools'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'
import {
  IProfile,
  IRoomType,
  IBaseRoomType,
  IPostRoomTypePayload,
} from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

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

  const data: IBaseRoomType = {
    hotelId: payload.hotelId,
    type: (typeof payload.type !== 'undefined') ? payload.type : '',
    description: (typeof payload.description !== 'undefined') ? payload.description : '',
    quantity: (typeof payload.quantity !== 'undefined') ? payload.quantity : 0,
    price: (typeof payload.price !== 'undefined') ? payload.price : 0,
    devConPrice: (typeof payload.devConPrice !== 'undefined') ? payload.devConPrice : 0,
    amenities: (typeof payload.amenities !== 'undefined') ? payload.amenities : '',
    imageUrl: (typeof payload.imageUrl !== 'undefined') ? payload.imageUrl : '',
  }
  const roomTypeId: string = await createRoomTypeRecord(data)
  const roomType: IRoomType = await readRoomTypeDbFunc(roomTypeId)

  return roomType
}

export {
  createRoomType,
}
