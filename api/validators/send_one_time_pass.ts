import { NowRequest } from '@vercel/node'

import { disableApiRequestsHere, CError } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function checkSendOneTimePass(request: NowRequest): void {
  if (!request.body) {
    throw new CError(500, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.email !== 'string')
  ) {
    throw new CError(500, 'must provide a valid email value')
  }

  if (
    (request.body.email.length === 0)
  ) {
    throw new CError(500, 'email value must not be empty')
  }

  if (
    (typeof request.body.sessionToken !== 'string')
  ) {
    throw new CError(500, 'must provide a valid sessionToken value')
  }

  if (
    (request.body.sessionToken.length === 0)
  ) {
    throw new CError(500, 'sessionToken value must not be empty')
  }
}

export {
  checkSendOneTimePass,
}
