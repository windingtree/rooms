import { NowRequest, NowResponse } from '@vercel/node'
import { genericApiMethodHandler, CError } from '../tools'

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, {})
}

/* --------------- internal API methods/structure below --------------- */

function checkLogin(request: NowRequest): void {
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
    (typeof request.body.oneTimePassword !== 'string')
  ) {
    throw new CError(500, 'must provide a valid oneTimePassword value')
  }

  if (
    (request.body.oneTimePassword.length === 0)
  ) {
    throw new CError(500, 'oneTimePassword value must not be empty')
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
  checkLogin,
}
