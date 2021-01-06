import { ProfileRepo } from '../../../_lib/data/profile/ProfileRepo'
import { HotelRepo } from '../../../_lib/data/hotel/HotelRepo'
import { IBaseProfile, IProfile, IPostProfilePayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { CError } from '../../../_lib/tools'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN, MANAGER, OWNER, OBSERVER } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const profileRepo = new ProfileRepo()

async function createProfile(requester: IProfile, payload: IPostProfilePayload): Promise<IProfile> {
  if (
    (requester.role === OWNER || requester.role === OBSERVER) ||
    (requester.role === MANAGER && payload.role === MANAGER) ||
    (payload.role === SUPER_ADMIN)
  ) {
    throw new CError(
      FORBIDDEN,
      `User with role '${requester.role}' is not allowed to create a profile with role '${payload.role}'.`
    )
  }

  if ((payload.oneTimePassword || payload.sessionToken) && (requester.role !== SUPER_ADMIN)) {
    throw new CError(
      FORBIDDEN,
      `User with role '${requester.role}' is not allowed to manually set auth data.`
    )
  }

  if (payload.hotelId) {
    await hotelRepo.readHotel(payload.hotelId)
  }

  const baseProfile: IBaseProfile = {
    email: payload.email,
    name: (payload.name) ? payload.name : '',
    phone: (payload.phone) ? payload.phone : '',
    oneTimePassword: (payload.oneTimePassword) ? payload.oneTimePassword : '',
    sessionToken: (payload.sessionToken) ? payload.sessionToken : '',
    role: payload.role,
    hotelId: (payload.hotelId) ? payload.hotelId : '',
  }
  const profileId: string = await profileRepo.createProfile(baseProfile)
  const profile: IProfile = Object.assign({}, baseProfile, { id: profileId })

  return profile
}

export {
  createProfile,
}
