import { createHotel as createHotelRecord } from '../../data/hotel'
import { readProfile as readProfileRecord } from '../../data/profile'
import { IProfile, IBaseHotel, IHotel, IPostHotelPayload } from '../../types'
import { CONSTANTS } from '../../infra/constants'
import { CError } from '../../tools'

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
    name: (payload.name) ? payload.name : '',
    address: (payload.address) ? payload.address : '',
    location: (payload.location) ? payload.location : { lat: 0, lng: 0 },
  }
  const hotel: IHotel = await createHotelRecord(data)

  return hotel
}

export {
  createHotel,
}
