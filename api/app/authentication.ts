import { getProfileAuth } from '../app'
import { CError, disableApiRequestsHere } from '../tools'
import { IProfileAuth } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function checkIfUserAuthenticated(email: string, oneTimePassword: string, sessionToken: string): Promise<void> {
  const profileAuth: IProfileAuth = await getProfileAuth(email)

  if (profileAuth.oneTimePassword !== oneTimePassword) {
    throw new CError(401, 'One time password is not valid.')
  }

  if (profileAuth.sessionToken !== sessionToken) {
    throw new CError(401, 'Session token is not valid.')
  }
}

export {
  checkIfUserAuthenticated,
}
