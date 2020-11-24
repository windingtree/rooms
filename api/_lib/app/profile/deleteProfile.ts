import {
  deleteProfile as deleteProfileDbFunc
} from '../../../_lib/data/profile'
import { IProfile } from '../../../_lib/types'

async function deleteProfile(requester: IProfile, profileId: string): Promise<void> {
  // TODO:
  // 1. Only `SUPER_ADMIN` can delete any profile.
  // 2. Manager can delete only his own profile, and `owner` + `observer` profiles.

  await deleteProfileDbFunc(profileId)
}

export {
  deleteProfile,
}
