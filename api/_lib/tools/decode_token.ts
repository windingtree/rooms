import { NowRequest } from '@vercel/node'
import * as jwt from 'jsonwebtoken'

import { CError } from '../tools'
import { ENV } from '../infra/env'
import { IDecodedAuthToken, IAnyObject } from '../types'

function decodeToken(request: NowRequest): IDecodedAuthToken {
  const authHeaderValue = request.headers['authorization']
  if (typeof authHeaderValue !== 'string' || authHeaderValue.length === 0) {
    throw new CError(401, 'Authorization request header missing.')
  }

  const bearerToken = authHeaderValue.split(' ')[1]
  if (typeof bearerToken !== 'string' || bearerToken.length === 0) {
    throw new CError(401, 'Authorization request header malformed.')
  }

  let decodedToken: IDecodedAuthToken|IAnyObject
  try {
    decodedToken = jwt.verify(bearerToken, ENV.REACT_APP_JWT_SECRET)
  } catch (err) {
    throw new CError(401, 'JWT token verification failed.')
  }
  const decodedAuthToken: IDecodedAuthToken = (decodedToken as IDecodedAuthToken)

  const requiredFields: Array<string> = ['email', 'oneTimePassword']
  requiredFields.every((field: string) => {
    if (typeof decodedAuthToken[field] !== 'string' || decodedAuthToken[field].length === 0) {
      throw new CError(401, `Field '${field}' is missing from JWT token.`)
    }

    return true
  })

  return decodedAuthToken
}

export {
  decodeToken,
}
