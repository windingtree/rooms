// node/npm imports
import * as jwt from 'jsonwebtoken'

// application layer imports
import { AppConfig } from '../../app/config'

// infrastructure layer imports
import { ENV } from '../../common/env'

// common imports
import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfileAuthData, IJwtToken } from '../../common/types'

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
