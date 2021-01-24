import { NowRequest } from '@vercel/node'

import { decodeClientAppToken } from '../../app/auth/client_app'
import { AppConfig } from '../../app/config'

import { CONSTANTS } from '../../common/constants'
import { getBearerToken, CError } from '../../common/tools'
import { IProfileAuthData } from '../../common/types'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

async function authenticateApiTestRequest(request: NowRequest): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'true') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IProfileAuthData = await decodeClientAppToken(bearerToken)
  const { oneTimePassword, sessionToken } = { ...decodedToken }

  if (
    (appConfig.API_TEST_ONE_TIME_PASSWORD !== oneTimePassword) ||
    (appConfig.API_TEST_SESSION_TOKEN !== sessionToken)
  ) {
    throw new CError(FORBIDDEN, 'API Test user contains wrong auth data.')
  }
}

export { authenticateApiTestRequest }
