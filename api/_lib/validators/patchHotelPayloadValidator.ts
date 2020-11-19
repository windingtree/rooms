import { NowRequest } from '@vercel/node'

import { validateOptionalString, validateOptionalLocation } from './helpers'
import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IPatchHotelPayload } from '../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchHotelPayloadValidator(request: NowRequest): Promise<IPatchHotelPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPatchHotelPayload = {}

  const ALLOWED_PROPS = [
    'ownerId',
    'name',
    'address',
    'location',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'hotel' is not updatable.`)
    }
  }

  const ownerId = request.body.ownerId
  await validateOptionalString('ownerId', ownerId)
  if (typeof ownerId !== 'undefined') payload.ownerId = ownerId

  const name = request.body.name
  await validateOptionalString('name', name)
  if (typeof name !== 'undefined') payload.name = name

  const address = request.body.address
  await validateOptionalString('address', address)
  if (typeof address !== 'undefined') payload.address = address

  const location = request.body.location
  await validateOptionalLocation('location', location)
  if (typeof location !== 'undefined') payload.location = location

  return payload
}

export {
  patchHotelPayloadValidator,
}
