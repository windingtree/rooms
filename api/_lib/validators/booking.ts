import { NowRequest } from '@vercel/node'

import { getRoomType } from '../../_lib/data/rooms_legacy'
import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function checkBooking(request: NowRequest): Promise<void> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.checkInDate !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid checkInDate value')
  }

  if (
    (typeof request.body.checkOutDate !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid checkOutDate value')
  }

  if (
    (typeof request.body.guestName !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid guestName value')
  }

  if (
    (typeof request.body.guestEmail !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid guestEmail value')
  }

  if (
    (typeof request.body.phoneNumber !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid phoneNumber value')
  }

  if (
    (typeof request.body.roomType !== 'string')
  ) {
    throw new CError(BAD_REQUEST, 'must provide a valid roomType value')
  }

  if (request.body.roomType !== '') {
    try {
      await getRoomType(request.body.roomType)
    } catch (err) {
      throw new CError(BAD_REQUEST, 'specified roomType does not exist')
    }
  }
}

export {
  checkBooking,
}
