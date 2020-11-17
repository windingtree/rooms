import * as jwt from 'jsonwebtoken'

import { CError } from '../../../tools'
import { ENV } from '../../../infra/env'
import { IDecodedAuthClientAppToken } from '../../../types'

const REACT_APP_JWT_SECRET = ENV.REACT_APP_JWT_SECRET

async function decodeClientAppToken(bearerToken: string): Promise<IDecodedAuthClientAppToken> {
  let decodedToken: IDecodedAuthClientAppToken|unknown
  try {
    decodedToken = jwt.verify(bearerToken, REACT_APP_JWT_SECRET)
  } catch (err) {
    throw new CError(401, 'JWT token verification failed.')
  }
  const decodedAuthClientAppToken: IDecodedAuthClientAppToken = (decodedToken as IDecodedAuthClientAppToken)

  const requiredFields: Array<keyof IDecodedAuthClientAppToken> = ['email', 'oneTimePassword']
  requiredFields.every((field) => {
    if (typeof decodedAuthClientAppToken[field] !== 'string' || decodedAuthClientAppToken[field].length === 0) {
      throw new CError(401, `Field '${field}' is missing from JWT token.`)
    }

    return true
  })

  return decodedAuthClientAppToken
}

export {
  decodeClientAppToken,
}
