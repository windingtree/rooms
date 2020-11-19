import { NowRequest } from '@vercel/node'

import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function checkRoomType(request: NowRequest): Promise<void> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.quantity !== 'number') &&
    (
      (typeof request.body.quantity !== 'string') ||
      (Number.isNaN(parseInt(request.body.quantity)))
    )
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid quantity value')
  }

  if (
    (typeof request.body.price !== 'number') &&
    (
      (typeof request.body.price !== 'string') ||
      (Number.isNaN(parseInt(request.body.price)))
    )
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid price value')
  }

  if (
    (typeof request.body.type !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid type value')
  }

  if (
    (typeof request.body.amenities !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid amenities value')
  }
}

export {
  checkRoomType,
}
