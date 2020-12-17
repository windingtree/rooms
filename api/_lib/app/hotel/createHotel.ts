import {
  createHotel as createHotelDbFunc,
  readHotel as readHotelDbFunc,
} from '../../../_lib/data/hotel'
import { readProfile as readProfileRecord } from '../../../_lib/data/profile'
import { IProfile, IBaseHotel, IHotel, IPostHotelPayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { CError } from '../../../_lib/tools'

const { SUPER_ADMIN, MANAGER, OBSERVER }  = CONSTANTS.PROFILE_ROLE

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

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

  const data: IBaseHotel = {
    ownerId: payload.ownerId,
    name: (typeof payload.name !== 'undefined') ? payload.name : '',
    description: (typeof payload.description !== 'undefined') ? payload.description : '',
    address: (typeof payload.address !== 'undefined') ? payload.address : '',
    location: (typeof payload.location !== 'undefined') ? payload.location : { lat: 0, lng: 0 },
    imageUrl: (typeof payload.imageUrl !== 'undefined') ? payload.imageUrl : '',
    email: (typeof payload.email !== 'undefined') ? payload.email : '',
  }
  const hotelId: string = await createHotelDbFunc(data)
  const hotel: IHotel = await readHotelDbFunc(hotelId)

  return hotel
}

export {
  createHotel,
}
