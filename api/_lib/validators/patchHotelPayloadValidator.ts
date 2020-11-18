import { NowRequest } from '@vercel/node'

import { validateOptionalString, validateOptionalLocation } from './helpers'
import { CError } from '../tools'
import { IUpdateHotelData } from '../types'

async function patchHotelPayloadValidator(request: NowRequest): Promise<IUpdateHotelData> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const payload: IUpdateHotelData = {}

  const ALLOWED_PROPS = [
    'ownerId',
    'name',
    'address',
    'location',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key)) {
      throw new CError(500, `Property '${key}' on 'hotel' is not updatable.`)
    }
  }

  const ownerId = request.body.ownerId
  await validateOptionalString('ownerId', ownerId)
  if (typeof ownerId !== undefined) payload.ownerId = ownerId

  const name = request.body.name
  await validateOptionalString('name', name)
  if (typeof name !== undefined) payload.name = name

  const address = request.body.address
  await validateOptionalString('address', address)
  if (typeof address !== undefined) payload.address = address

  const location = request.body.location
  await validateOptionalLocation('location', location)
  if (typeof location !== undefined) payload.location = location

  return payload
}

export {
  patchHotelPayloadValidator,
}
