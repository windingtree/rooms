import * as jwt from 'jsonwebtoken'

import { CError } from '../../../../_lib/tools'
import { ENV } from '../../../../_lib/infra/env'
import { CONSTANTS } from '../../../infra/constants'
import { IProfileAuthData } from '../../../../_lib/types'

const { REACT_APP_JWT_SECRET } = ENV
const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function decodeClientAppToken(bearerToken: string): Promise<IProfileAuthData> {
  let decodedToken: IProfileAuthData|unknown
  try {
    decodedToken = jwt.verify(bearerToken, REACT_APP_JWT_SECRET)
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'JWT token verification failed.')
  }
  const decodedAuthClientAppToken: IProfileAuthData = (decodedToken as IProfileAuthData)

  const requiredFields: Array<keyof IProfileAuthData> = ['email', 'oneTimePassword']
  requiredFields.every((field) => {
    if (typeof decodedAuthClientAppToken[field] !== 'string' || decodedAuthClientAppToken[field].length === 0) {
      throw new CError(UNAUTHORIZED, `Field '${field}' is missing from JWT token.`)
    }

    return true
  })

  return decodedAuthClientAppToken
}

export {
  decodeClientAppToken,
}
