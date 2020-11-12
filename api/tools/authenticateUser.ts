import { getProfileAuth } from '../app/rooms'
import { CError, disableApiRequestsHere } from '../tools'
import { IProfileAuth } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function authenticateUser(email: string, oneTimePassword: string, sessionToken: string): Promise<IProfileAuth> {
  const profileAuth: IProfileAuth = await getProfileAuth(email)

  if (profileAuth.oneTimePassword !== oneTimePassword) {
    throw new CError(401, 'One time password is not valid.')
  }

  if (profileAuth.sessionToken !== sessionToken) {
    throw new CError(401, 'Session token is not valid.')
  }

  return profileAuth
}

export {
  authenticateUser,
}
