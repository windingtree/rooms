import { createProfile as createProfileRecord } from '../../../_lib/data/profile'
import { IBaseProfile, IProfile, IPostProfilePayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { CError } from '../../../_lib/tools'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN, MANAGER, OWNER, OBSERVER } = CONSTANTS.PROFILE_ROLE

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

  const data: IBaseProfile = {
    email: payload.email,
    name: (payload.name) ? payload.name : '',
    phone: (payload.phone) ? payload.phone : '',
    oneTimePassword: '',
    sessionToken: '',
    role: payload.role,
    hotelId: '',
  }
  const profileId: string = await createProfileRecord(data)
  const profile: IProfile = Object.assign({}, data, { id: profileId })

  return profile
}

export {
  createProfile,
}
