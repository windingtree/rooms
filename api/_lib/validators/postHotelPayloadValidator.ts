import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateRequiredLocation } from './helpers'
import { CError } from '../tools'
import { IPostHotelPayload } from '../types'

async function postHotelPayloadValidator(request: NowRequest): Promise<IPostHotelPayload> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const payload: IPostHotelPayload = {
    ownerId: '',
    name: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
  }

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

  await validateRequiredString('ownerId', request.body.ownerId)
  payload.ownerId = request.body.ownerId

  await validateRequiredString('name', request.body.name)
  payload.name = request.body.name

  await validateRequiredString('address', request.body.address)
  payload.address = request.body.address

  await validateRequiredLocation('location', request.body.location)
  payload.location = request.body.location

  return payload
}

export {
  postHotelPayloadValidator,
}
