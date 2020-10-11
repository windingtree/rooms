import { NowRequest } from '@vercel/node'

function checkBooking(request: NowRequest): void {
  if (!request.body) {
    throw 'must provide a valid body with request'
  }

  if (
    (typeof request.body.checkInDate !== 'string')
  ) {
    throw 'must provide a valid checkInDate value'
  }

  if (
    (typeof request.body.checkOutDate !== 'string')
  ) {
    throw 'must provide a valid checkOutDate value'
  }

  if (
    (typeof request.body.guestName !== 'string')
  ) {
    throw 'must provide a valid guestName value'
  }

  if (
    (typeof request.body.guestEmail !== 'string')
  ) {
    throw 'must provide a valid guestEmail value'
  }

  if (
    (typeof request.body.phoneNumber !== 'string')
  ) {
    throw 'must provide a valid phoneNumber value'
  }

  if (
    (typeof request.body.roomType !== 'string')
  ) {
    throw 'must provide a valid roomType value'
  }
}

export {
  checkBooking,
}
