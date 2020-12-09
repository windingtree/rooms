import { NowRequest } from '@vercel/node'

import { decodeClientAppToken } from '../../../_lib/app/auth/client_app'
import { AppConfig } from '../../../_lib/infra/config'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { getBearerToken, CError } from '../../../_lib/tools'
import { IProfileAuthData } from '../../../_lib/types'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

async function authenticateApiTestRequest(request: NowRequest): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IProfileAuthData = await decodeClientAppToken(bearerToken)
  const { email, oneTimePassword, sessionToken } = { ...decodedToken }

  if (
    (appConfig.API_TEST_EMAIL !== email) ||
    (appConfig.API_TEST_ONE_TIME_PASSWORD !== oneTimePassword) ||
    (appConfig.API_TEST_SESSION_TOKEN !== sessionToken)
  ) {
    throw new CError(FORBIDDEN, 'API Test user contains wrong auth data.')
  }
}

export {
  authenticateApiTestRequest,
}
