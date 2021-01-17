// data layer imports
import { ProfileRepo } from '../../data/profile/ProfileRepo'

// common imports
import { IProfile, IProfileCollection } from '../../common/types'

const profileRepo = new ProfileRepo()

async function getAllProfiles(requester: IProfile): Promise<IProfileCollection> {
  // TODO:
  // 1. `SUPER_ADMIN` can read any profile.
  // 2. `MANAGER` can read only his profile, and `OWNER` + `OBSERVER` profiles which he created.

  const profileCollection: IProfileCollection = await profileRepo.readProfiles()

  return profileCollection
}

export {
  getAllProfiles,
}
