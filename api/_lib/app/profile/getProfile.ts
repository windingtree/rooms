import { readProfile, readProfileByOwnerId } from '../../../_lib/data/profile'
import { IProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getProfile(requester: IProfile, profileId: string): Promise<IProfile> {
  let profile: IProfile

  if (requester.role === SUPER_ADMIN) {
    profile = await readProfile(profileId)
  } else {
    profile = await readProfileByOwnerId(profileId, requester.id)
  }

  return profile
}

export {
  getProfile,
}
