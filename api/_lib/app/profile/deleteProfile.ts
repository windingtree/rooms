// data layer imports
import { ProfileRepo } from '../../data/profile/ProfileRepo'

// common imports
import { IProfile, IStatus } from '../../common/types'

const profileRepo = new ProfileRepo()

async function deleteProfile(requester: IProfile, profileId: string): Promise<IStatus> {
  // TODO:
  // 1. Only `SUPER_ADMIN` can delete any profile.
  // 2. Manager can delete only his own profile, and `owner` + `observer` profiles.

  await profileRepo.deleteProfile(profileId)

  return { status: 'OK' }
}

export {
  deleteProfile,
}
