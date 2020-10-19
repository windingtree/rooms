import { NowRequest } from '@vercel/node'

import { disableApiRequestsHere, CError } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function checkRoomType(request: NowRequest): void {
  if (!request.body) {
    throw new CError(500, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.quantity !== 'number') &&
    (
      (typeof request.body.quantity !== 'string') ||
      (Number.isNaN(parseInt(request.body.quantity)))
    )
  ) {
    throw new CError(500, 'must provide a valid quantity value')
  }

  if (
    (typeof request.body.price !== 'number') &&
    (
      (typeof request.body.price !== 'string') ||
      (Number.isNaN(parseInt(request.body.price)))
    )
  ) {
    throw new CError(500, 'must provide a valid price value')
  }

  if (
    (typeof request.body.type !== 'string')
  ) {
    throw new CError(500, 'must provide a valid type value')
  }

  if (
    (typeof request.body.amenities !== 'string')
  ) {
    throw new CError(500, 'must provide a valid amenities value')
  }
}

export {
  checkRoomType,
}
