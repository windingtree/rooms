import { NowRequest } from '@vercel/node'

import { decodeToken, disableApiRequestsHere, authenticateUser } from '../tools'
import { IDecodedAuthToken, IProfileAuth } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function getUserAuthDetails(request: NowRequest): Promise<IProfileAuth> {
  const decodedToken: IDecodedAuthToken = decodeToken(request)

  const email: string = decodedToken.email
  const oneTimePassword: string = decodedToken.oneTimePassword
  const sessionToken: string = decodedToken.sessionToken

  const profileAuth: IProfileAuth = await authenticateUser(email, oneTimePassword, sessionToken)

  return profileAuth
}

export {
  getUserAuthDetails,
}
