import { NowRequest } from '@vercel/node'

import { decodeClientAppToken, authenticateClientAppUser } from '../../../../_lib/app/auth/client_app'
import { getBearerToken } from '../../../../_lib/tools'
import { IProfileAuthData, IProfile } from '../../../../_lib/types'

async function authenticateClientAppRequest(request: NowRequest): Promise<IProfile> {
  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IProfileAuthData = await decodeClientAppToken(bearerToken)
  const { email, oneTimePassword, sessionToken } = { ...decodedToken }

  const profile: IProfile = await authenticateClientAppUser({ email, oneTimePassword, sessionToken })

  return profile
}

export {
  authenticateClientAppRequest,
}
