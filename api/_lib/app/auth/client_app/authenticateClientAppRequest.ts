import { NowRequest } from '@vercel/node'

import { decodeClientAppToken, authenticateClientAppUser } from '../../../app/auth'
import { getBearerToken } from '../../../tools'
import { IDecodedAuthClientAppToken, IProfile } from '../../../types'

async function authenticateClientAppRequest(request: NowRequest): Promise<IProfile> {
  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IDecodedAuthClientAppToken = await decodeClientAppToken(bearerToken)
  const { email, oneTimePassword, sessionToken } = { ...decodedToken }

  const profile: IProfile = await authenticateClientAppUser(email, oneTimePassword, sessionToken)

  return profile
}

export {
  authenticateClientAppRequest,
}
