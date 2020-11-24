import {
  profileMapper,
  updateProfile as updateProfileDbFunc,
  readProfile
} from '../../../_lib/data/profile'
import { IProfile, IPatchProfilePayload, IProfileDbRecord } from '../../../_lib/types'

async function updateProfile(requester: IProfile, profileId: string, data: IPatchProfilePayload): Promise<IProfile> {
  // TODO:
  // 1. Only `SUPER_ADMIN` can patch any profile.
  // 2. All other roles can only patch their own profile.

  await updateProfileDbFunc(profileId, data)

  const profileDbRecord: IProfileDbRecord = await readProfile(profileId)
  const profile: IProfile = profileMapper(profileDbRecord)

  return profile
}

export {
  updateProfile,
}
