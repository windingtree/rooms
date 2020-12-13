import {
  updateProfile as updateProfileDbFunc,
  readProfile as readProfileDbFunc,
} from '../../../_lib/data/profile'
import { IProfile, IPatchProfilePayload } from '../../../_lib/types'

async function updateProfile(requester: IProfile, profileId: string, data: IPatchProfilePayload): Promise<IProfile> {
  // TODO:
  // 1. Only `SUPER_ADMIN` can patch any profile.
  // 2. All other roles can only patch their own profile.

  await updateProfileDbFunc(profileId, data)
  const profile: IProfile = await readProfileDbFunc(profileId)

  return profile
}

export {
  updateProfile,
}
