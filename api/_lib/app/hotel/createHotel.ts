import { createHotel as createHotelRecord } from '../../../_lib/data/hotel'
import { readProfile as readProfileRecord } from '../../../_lib/data/profile'
import { IProfile, IBaseHotel, IHotel, IPostHotelPayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { CError } from '../../../_lib/tools'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN
const MANAGER = CONSTANTS.PROFILE_ROLE.MANAGER
const OWNER = CONSTANTS.PROFILE_ROLE.OWNER
const OBSERVER = CONSTANTS.PROFILE_ROLE.OBSERVER

const BAD_REQUEST = CONSTANTS.HTTP_STATUS.BAD_REQUEST

function generalErrorForHotelCreation(requester: IProfile, ownerProfile: IProfile) {
  throw new CError(
    BAD_REQUEST,
    `User with role '${requester.role}' can't create a hotel for another user with role '${ownerProfile.role}'.`
  )
}

async function createHotel(requester: IProfile, payload: IPostHotelPayload): Promise<IHotel> {
  const ownerProfile: IProfile = await readProfileRecord(payload.ownerId)

  if (ownerProfile.role === OBSERVER) {
    generalErrorForHotelCreation(requester, ownerProfile)
  }

  if (requester.id !== ownerProfile.id) {
    switch (requester.role) {
      case SUPER_ADMIN:
        if (ownerProfile.role === SUPER_ADMIN) {
          generalErrorForHotelCreation(requester, ownerProfile)
        }
        break
      case MANAGER:
        if (ownerProfile.role === SUPER_ADMIN || ownerProfile.role === MANAGER) {
          generalErrorForHotelCreation(requester, ownerProfile)
        }
        break
    }
  }

  if (ownerProfile.role === OWNER) {
    generalErrorForHotelCreation(requester, ownerProfile)
  }

  const data: IBaseHotel = {
    ownerId: payload.ownerId,
    name: (typeof payload.name !== 'undefined') ? payload.name : '',
    address: (typeof payload.address !== 'undefined') ? payload.address : '',
    location: (typeof payload.location !== 'undefined') ? payload.location : { lat: 0, lng: 0 },
  }
  const hotelId: string = await createHotelRecord(data)
  const hotel: IHotel = Object.assign({}, data, { id: hotelId })

  return hotel
}

export {
  createHotel,
}
