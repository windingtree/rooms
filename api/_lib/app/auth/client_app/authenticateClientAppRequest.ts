// node/npm imports
import { NowRequest } from '@vercel/node'

// application layer imports
import { decodeClientAppToken, authenticateClientAppUser } from './'

// common imports
import { getBearerToken } from '../../../common/tools'
import { IProfileAuthData, IProfile } from '../../../common/types'

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
