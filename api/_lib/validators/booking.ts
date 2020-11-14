import { NowRequest } from '@vercel/node'

import { getRoomType } from '../data/rooms'
import { CError } from '../tools'

async function checkBooking(request: NowRequest): Promise<void> {
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

  if (request.body.roomType !== '') {
    try {
      await getRoomType(request.body.roomType)
    } catch (err) {
      throw new CError(500, 'specified roomType does not exist')
    }
  }
}

export {
  checkBooking,
}
