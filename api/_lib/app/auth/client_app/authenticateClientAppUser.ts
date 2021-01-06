import { ProfileRepo } from '../../../../_lib/data/profile/ProfileRepo'
import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IProfile, IProfileAuthData } from '../../../../_lib/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

const profileRepo = new ProfileRepo()

async function authenticateClientAppUser(payload: IProfileAuthData): Promise<IProfile> {
  let profile: IProfile
  try {
    profile = await profileRepo.readProfileByEmail(payload.email)
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'User profile does not exist.', err)
  }

  if (profile.oneTimePassword !== payload.oneTimePassword) {
    throw new CError(UNAUTHORIZED, 'One time password is not valid.')
  }

  if (profile.sessionToken !== payload.sessionToken) {
    throw new CError(UNAUTHORIZED, 'Session token is not valid.')
  }

  return profile
}

export {
  authenticateClientAppUser,
}
