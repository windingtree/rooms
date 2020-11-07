import { NowRequest } from '@vercel/node'

import { checkIfUserAuthenticated } from '../app'
import { decodeToken, disableApiRequestsHere } from './'
import { IDecodedAuthToken, IUserAuthDetails } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function getUserAuthDetails(request: NowRequest): Promise<IUserAuthDetails> {
  const decodedToken: IDecodedAuthToken = decodeToken(request)

  const email: string = decodedToken.email
  const oneTimePassword: string = decodedToken.oneTimePassword
  const sessionToken: string = decodedToken.sessionToken

  await checkIfUserAuthenticated(email, oneTimePassword, sessionToken)

  return {
    userIsAuthenticated: true, email, oneTimePassword
  }
}

export {
  getUserAuthDetails,
}
