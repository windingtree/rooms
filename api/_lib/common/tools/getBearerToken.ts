import { NowRequest } from '@vercel/node'
import * as jwt from 'jsonwebtoken'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'

const { UNAUTHORIZED }  = CONSTANTS.HTTP_STATUS

function jwtParse(token: string): Promise<void> {
  let resolve: () => void
  let reject: (err: unknown) => void

  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  jwt.verify(token, 'test', (err, decoded) => {
    if (err && err.message === 'jwt malformed') {
      reject(err)
    }

    resolve()
  })

  return promise
}

async function getBearerToken(request: NowRequest): Promise<string> {
  const authHeaderValue = request.headers['authorization']
  if (typeof authHeaderValue !== 'string' || authHeaderValue.length === 0) {
    throw new CError(UNAUTHORIZED, 'Authorization request header missing.')
  }

  const [bearerKey, bearerToken] = authHeaderValue.split(' ')

  if (typeof bearerKey !== 'string' || bearerKey !== 'Bearer') {
    throw new CError(UNAUTHORIZED, 'Authorization request header malformed.')
  }

  if (typeof bearerToken !== 'string' || bearerToken.length === 0) {
    throw new CError(UNAUTHORIZED, 'Bearer token is missing.')
  }

  try {
    await jwtParse(bearerToken)
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'Bearer token is malformed.', err)
  }

  return bearerToken
}

export { getBearerToken }
