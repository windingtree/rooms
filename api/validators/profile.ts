import { NowRequest } from '@vercel/node'

import { disableApiRequestsHere, CError } from '../tools'
import { IHotelLocation } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function checkProfilePatchData(request: NowRequest): Promise<void> {
  if (!request.body) {
    throw new CError(500, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.property !== 'string')
  ) {
    throw new CError(500, 'must provide a valid property')
  }

  const ALLOWED_PATCH_PROPERTIES = [
    'hotelName',
    'hotelAddress',
    'hotelLocation',
  ]
  if (
    (!ALLOWED_PATCH_PROPERTIES.includes(request.body.property))
  ) {
    throw new CError(500, 'patch property is invalid')
  }

  if (
    (request.body.property === 'hotelLocation')
  ) {
    const location: IHotelLocation = request.body.value

    if (typeof location.lat !== 'number') {
      throw new CError(500, 'location value is missing lat param')
    }
    if (typeof location.lng !== 'number') {
      throw new CError(500, 'location value is missing lng param')
    }
  } else {
    if (
      (typeof request.body.value !== 'string')
    ) {
      throw new CError(500, 'must provide a valid value')
    }
  }
}

export {
  checkProfilePatchData,
}
