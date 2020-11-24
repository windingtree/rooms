import { profileMapper, readProfileByEmail } from '../../../../_lib/data/profile'
import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IProfile, IProfileDbRecord, IProfileAuthData } from '../../../../_lib/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function authenticateClientAppUser(payload: IProfileAuthData): Promise<IProfile> {
  let profile: IProfile
  try {
    const profileDbRecord: IProfileDbRecord = await readProfileByEmail(payload.email)
    profile = profileMapper(profileDbRecord)
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'User profile does not exist.')
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
