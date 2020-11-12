import { NowRequest } from '@vercel/node'

import { decodeToken, authenticateUser } from '../tools'
import { IDecodedAuthToken, IProfile } from '../types'


async function authenticateRequest(request: NowRequest): Promise<IProfile> {
  const decodedToken: IDecodedAuthToken = decodeToken(request)

  const email: string = decodedToken.email
  const oneTimePassword: string = decodedToken.oneTimePassword
  const sessionToken: string = decodedToken.sessionToken

  const profile: IProfile = await authenticateUser(email, oneTimePassword, sessionToken)

  return profile
}

export {
  authenticateRequest,
}
