import { profileMapper, readProfile } from '../../../_lib/data/profile'
import { IProfile, IProfileDbRecord } from '../../../_lib/types'

async function getProfile(requester: IProfile, profileId: string): Promise<IProfile> {
  // TODO:
  // 1. `SUPER_ADMIN` can read any profile.
  // 2. `MANAGER` can read only his profile, and `OWNER` + `OBSERVER` profiles which he created.

  const profileDbRecord: IProfileDbRecord = await readProfile(profileId)
  const profile: IProfile = profileMapper(profileDbRecord)

  return profile
}

export {
  getProfile,
}
