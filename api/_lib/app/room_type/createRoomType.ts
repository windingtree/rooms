import { createRoomType as createRoomTypeRecord } from '../../../_lib/data/room_type'
import { readProfile as readProfileRecord } from '../../../_lib/data/profile'
import { IProfile, IBaseRoomType, IRoomType, IPostRoomTypePayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { CError } from '../../../_lib/tools'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN
const MANAGER = CONSTANTS.PROFILE_ROLE.MANAGER
const OBSERVER = CONSTANTS.PROFILE_ROLE.OBSERVER

const BAD_REQUEST = CONSTANTS.HTTP_STATUS.BAD_REQUEST

function generalErrorForRoomTypeCreation(requester: IProfile, ownerProfile: IProfile) {
  throw new CError(
    BAD_REQUEST,
    `User with role '${requester.role}' can't create a roomType for another user with role '${ownerProfile.role}'.`
  )
}

async function createRoomType(requester: IProfile, payload: IPostRoomTypePayload): Promise<IRoomType> {
  const ownerProfile: IProfile = await readProfileRecord(payload.ownerId)

  if (ownerProfile.role === OBSERVER) {
    generalErrorForRoomTypeCreation(requester, ownerProfile)
  }

  if (requester.id !== ownerProfile.id) {
    switch (requester.role) {
      case SUPER_ADMIN:
        if (ownerProfile.role === SUPER_ADMIN) {
          generalErrorForRoomTypeCreation(requester, ownerProfile)
        }
        break
      case MANAGER:
        if (ownerProfile.role === SUPER_ADMIN || ownerProfile.role === MANAGER) {
          generalErrorForRoomTypeCreation(requester, ownerProfile)
        }
        break
    }
  }

  const data: IBaseRoomType = {
    ownerId: payload.ownerId,
    hotelId: payload.hotelId,
    type: payload.type,
    quantity: (typeof payload.quantity !== 'undefined') ? payload.quantity : 0,
    price: (typeof payload.price !== 'undefined') ? payload.price : 0,
    amenities: (typeof payload.amenities !== 'undefined') ? payload.amenities : '',
  }
  const roomTypeId: string = await createRoomTypeRecord(data)
  const roomType: IRoomType = Object.assign({}, data, { id: roomTypeId })

  return roomType
}

export {
  createRoomType,
}
