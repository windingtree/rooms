import { ProfileRepo } from '../../data/profile/ProfileRepo'

import { IProfile, IPatchProfilePayload } from '../../common/types'

const profileRepo = new ProfileRepo()

async function updateProfile(requester: IProfile, profileId: string, data: IPatchProfilePayload): Promise<IProfile> {
  // TODO:
  // 1. Only `SUPER_ADMIN` can patch any profile.
  // 2. All other roles can only patch their own profile.

  await profileRepo.updateProfile(profileId, data)
  const profile: IProfile = await profileRepo.readProfile(profileId)

  return profile
}

export { updateProfile }
