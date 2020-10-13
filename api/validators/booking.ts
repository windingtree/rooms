import { NowRequest } from '@vercel/node'

import { CError } from '../tools'

function checkBooking(request: NowRequest): void {
  if (!request.body) {
    throw new CError(500, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.checkInDate !== 'string')
  ) {
    throw new CError(500, 'must provide a valid checkInDate value')
  }

  if (
    (typeof request.body.checkOutDate !== 'string')
  ) {
    throw new CError(500, 'must provide a valid checkOutDate value')
  }

  if (
    (typeof request.body.guestName !== 'string')
  ) {
    throw new CError(500, 'must provide a valid guestName value')
  }

  if (
    (typeof request.body.guestEmail !== 'string')
  ) {
    throw new CError(500, 'must provide a valid guestEmail value')
  }

  if (
    (typeof request.body.phoneNumber !== 'string')
  ) {
    throw new CError(500, 'must provide a valid phoneNumber value')
  }

  if (
    (typeof request.body.roomType !== 'string')
  ) {
    throw new CError(500, 'must provide a valid roomType value')
  }
}

export {
  checkBooking,
}
