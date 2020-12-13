import * as jwt from 'jsonwebtoken'

import { AppConfig } from '../../../_lib/infra/config'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { ENV } from '../../../_lib/infra/env'
import { CError } from '../../../_lib/tools'
import { IProfileAuthData, IJwtToken } from '../../../_lib/types'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

async function generateJwtToken(payload: IProfileAuthData): Promise<IJwtToken> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const token = jwt.sign(payload, ENV.REACT_APP_JWT_SECRET)

  return {
    jwt: token,
  }
}

export {
  generateJwtToken,
}
