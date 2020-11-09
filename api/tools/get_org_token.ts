import { NowRequest } from '@vercel/node'

import { CError, disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function getOrgToken(request: NowRequest): string {
  const authHeaderValue = request.headers['authorization']
  if (typeof authHeaderValue !== 'string' || authHeaderValue.length === 0) {
    throw new CError(401, 'Authorization request header missing.')
  }

  const bearerToken = authHeaderValue.split(' ')[1]
  if (typeof bearerToken !== 'string' || bearerToken.length === 0) {
    throw new CError(401, 'Authorization request header malformed.')
  }

  return bearerToken
}

export {
  getOrgToken,
}
