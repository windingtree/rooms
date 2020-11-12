import { createProfile as createProfileRecord } from '../../data/profile'
import { IBaseProfile, IProfile, IPostProfilePayload } from '../../types'
import { CONSTANTS } from '../../infra/constants'
import { CError } from '../../tools'

async function createProfile(requester: IProfile, payload: IPostProfilePayload): Promise<IProfile> {
  if (
    (requester.role === CONSTANTS.PROFILE_ROLE.OWNER || requester.role === CONSTANTS.PROFILE_ROLE.OBSERVER) ||
    (requester.role === CONSTANTS.PROFILE_ROLE.MANAGER && payload.role === CONSTANTS.PROFILE_ROLE.MANAGER) ||
    (payload.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN)
  ) {
    throw new CError(
      403,
      `User with role '${requester.role}' is not allowed to create a profile with role '${payload.role}'.`
    )
  }

  const data: IBaseProfile = {
    email: payload.email,
    name: (payload.name) ? payload.name : '',
    phone: (payload.phone) ? payload.phone : '',
    oneTimePassword: '',
    sessionToken: '',
    role: payload.role,
    hotelId: '',
  }
  const profile: IProfile = await createProfileRecord(data)

  return profile
}

export {
  createProfile,
}
