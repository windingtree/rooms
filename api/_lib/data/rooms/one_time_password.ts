import { v4 as uuidv4 } from 'uuid'

import { readProfileByEmail, createProfile, updateProfile } from '../../data'
import { IProfile } from '../../types'
import { CONSTANTS } from '../../infra/constants'

async function getOneTimePassword(email: string, sessionToken: string): Promise<string> {
  const oneTimePassword: string = uuidv4()

  let profile: IProfile|null
  try {
    profile = await readProfileByEmail(email)
  } catch (err) {
    // Maybe a profile for the given email does not exist? We will try to create a new one below.
    profile = null
  }

  if (profile === null) {
    await createProfile({
      email,
      oneTimePassword,
      sessionToken,
      role: CONSTANTS.PROFILE_ROLE.OWNER,
    })
  } else {
    await updateProfile(profile.id, { oneTimePassword, sessionToken })
  }

  return oneTimePassword
}

export {
  getOneTimePassword,
}
