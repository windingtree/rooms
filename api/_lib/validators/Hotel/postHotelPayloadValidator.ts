import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString, validateOptionalLocation } from '../_helpers'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IPostHotelPayload } from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postHotelPayloadValidator(request: NowRequest): Promise<IPostHotelPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
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

  const ALLOWED_PROPS: Array <keyof IPostHotelPayload> = [
    'ownerId',
    'name',
    'address',
    'location',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostHotelPayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'hotel' is not updatable.`)
    }
  }

  const ownerId = request.body.ownerId
  await validateRequiredString('ownerId', ownerId)
  payload.ownerId = ownerId

  const name = request.body.name
  await validateOptionalString('name', name)
  payload.name = name

  const address = request.body.address
  await validateOptionalString('address', address)
  if (typeof address !== 'undefined') payload.address = address

  const location = request.body.location
  await validateOptionalLocation('location', location)
  if (typeof location !== 'undefined') payload.location = location

  return payload
}

export {
  postHotelPayloadValidator,
}
