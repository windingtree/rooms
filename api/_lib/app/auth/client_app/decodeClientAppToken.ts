import * as jwt from 'jsonwebtoken'

import { CONSTANTS } from '../../../common/constants'
import { ENV } from '../../../common/env'
import { CError } from '../../../common/tools'
import { IProfileAuthData } from '../../../common/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function decodeClientAppToken(bearerToken: string): Promise<IProfileAuthData> {
  let decodedToken: IProfileAuthData|unknown
  try {
    decodedToken = jwt.verify(bearerToken, ENV.REACT_APP_JWT_SECRET)
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'JWT token verification failed.', err)
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

export { decodeClientAppToken }
