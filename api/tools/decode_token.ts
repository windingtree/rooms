import { NowRequest, NowResponse } from '@vercel/node'
import * as jwt from 'jsonwebtoken'

import { IDecodedAuthToken } from '../types/auth'

const JWT_SECRET = 'wjjEQRQvCYX5e3ClaPTy8jaYapwWacJiAHnyRNXoHlge7iWjLSo7PDqitV9FnYsS'
const REQUIRED_JWT_FIELDS = [ 'email', 'oneTimePassword' ]

function decodeToken(request: NowRequest, response: NowResponse): IDecodedAuthToken | null {
  const authHeaderValue = request.headers['authorization']
  if (typeof authHeaderValue !== 'string' || authHeaderValue.length === 0) {
    response.status(401).json({ err: 'authorization request header missing', authHeaderValue })
    return null
  }

  const bearerToken = authHeaderValue.split(' ')[1]
  if (typeof bearerToken !== 'string' || bearerToken.length === 0) {
    response.status(401).json({ err: 'authorization request header malformed', bearerToken })
    return null
  }

  let decodedToken: string|object
  try {
    decodedToken = jwt.verify(bearerToken, JWT_SECRET)
  } catch (err) {
    response.status(401).json({ err })
    return null
  }
  const decodedAuthToken: IDecodedAuthToken = (decodedToken as IDecodedAuthToken)

  const allTokenFieldsPresent = REQUIRED_JWT_FIELDS.every((field) => {
    if (typeof decodedAuthToken[field] !== 'string' || decodedAuthToken[field].length === 0) {
      return false
    }

    return true
  })
  if (!allTokenFieldsPresent) {
    response.status(401).json({ err: 'some fields missing from JWT token' })
    return null
  }

  return decodedAuthToken
}

export {
  decodeToken
}
