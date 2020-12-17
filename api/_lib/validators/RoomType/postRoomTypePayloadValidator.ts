import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString, validateOptionalNumber } from '../_helpers'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IPostRoomTypePayload } from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postRoomTypePayloadValidator(request: NowRequest): Promise<IPostRoomTypePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostRoomTypePayload = {
    hotelId: '',
  }

  const ALLOWED_PROPS: Array<keyof IPostRoomTypePayload> = [
    'hotelId',
    'type',
    'description',
    'quantity',
    'price',
    'amenities',
    'imageUrl',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostRoomTypePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'roomType' is not settable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateRequiredString('hotelId', hotelId)
  payload.hotelId = hotelId

  const type = request.body.type
  await validateOptionalString('type', type)
  if (typeof type !== 'undefined') payload.type = type

  const description = request.body.description
  await validateOptionalString('description', description)
  if (typeof description !== 'undefined') payload.description = description

  const quantity = request.body.quantity
  await validateOptionalNumber('quantity', quantity)
  if (typeof quantity !== 'undefined') payload.quantity = quantity

  const price = request.body.price
  await validateOptionalNumber('price', price)
  if (typeof price !== 'undefined') payload.price = price

  const amenities = request.body.amenities
  await validateOptionalString('amenities', amenities)
  if (typeof amenities !== 'undefined') payload.amenities = amenities

  const imageUrl = request.body.imageUrl
  await validateOptionalString('imageUrl', imageUrl)
  if (typeof imageUrl !== 'undefined') payload.imageUrl = imageUrl

  return payload
}

export {
  postRoomTypePayloadValidator,
}
