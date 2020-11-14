import { readProfileByEmail } from '../data'
import { CError } from '../tools'
import { IProfile } from '../types'


async function authenticateUser(email: string, oneTimePassword: string, sessionToken: string): Promise<IProfile> {
  const profile: IProfile = await readProfileByEmail(email)

  if (profile.oneTimePassword !== oneTimePassword) {
    throw new CError(401, 'One time password is not valid.')
  }

  if (profile.sessionToken !== sessionToken) {
    throw new CError(401, 'Session token is not valid.')
  }

  return profile
}

export {
  authenticateUser,
}
