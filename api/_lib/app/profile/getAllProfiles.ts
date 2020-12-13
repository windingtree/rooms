import {
  readProfiles as readProfilesDbFunc,
} from '../../../_lib/data/profile'
import { IProfile, IProfileCollection } from '../../../_lib/types'

async function getAllProfiles(requester: IProfile): Promise<IProfileCollection> {
  // TODO:
  // 1. `SUPER_ADMIN` can read any profile.
  // 2. `MANAGER` can read only his profile, and `OWNER` + `OBSERVER` profiles which he created.

  const profileCollection: IProfileCollection = await readProfilesDbFunc()

  return profileCollection
}

export {
  getAllProfiles,
}
