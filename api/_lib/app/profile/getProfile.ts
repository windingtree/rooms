import { readProfile as readProfileDbFunc } from '../../../_lib/data/profile'
import { IProfile } from '../../../_lib/types'

async function getProfile(requester: IProfile, profileId: string): Promise<IProfile> {
  // TODO:
  // 1. `SUPER_ADMIN` can read any profile.
  // 2. `MANAGER` can read only his profile, and `OWNER` + `OBSERVER` profiles which he created.

  const profile: IProfile = await readProfileDbFunc(profileId)

  return profile
}

export {
  getProfile,
}
