// data layer imports
import { ProfileRepo } from '../../data/profile/ProfileRepo'

// common imports
import { IProfile } from '../../common/types'

const profileRepo = new ProfileRepo()

async function getProfile(requester: IProfile, profileId: string): Promise<IProfile> {
  // TODO:
  // 1. `SUPER_ADMIN` can read any profile.
  // 2. `MANAGER` can read only his profile, and `OWNER` + `OBSERVER` profiles which he created.

  const profile: IProfile = await profileRepo.readProfile(profileId)

  return profile
}

export {
  getProfile,
}
