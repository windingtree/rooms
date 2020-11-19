import { NowRequest } from '@vercel/node'

import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function checkLogin(request: NowRequest): Promise<void> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.email !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid email value')
  }

  if (
    (request.body.email.length === 0)
  ) {
    throw new CError(BAD_REQUEST, 'email value must not be empty')
  }

  if (
    (typeof request.body.oneTimePassword !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid oneTimePassword value')
  }

  if (
    (request.body.oneTimePassword.length === 0)
  ) {
    throw new CError(BAD_REQUEST, 'oneTimePassword value must not be empty')
  }

  if (
    (typeof request.body.sessionToken !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid sessionToken value')
  }

  if (
    (request.body.sessionToken.length === 0)
  ) {
    throw new CError(BAD_REQUEST, 'sessionToken value must not be empty')
  }
}

export {
  checkLogin,
}
