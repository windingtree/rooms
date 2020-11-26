import { NowRequest } from '@vercel/node'

import { validateOptionalString, validateOptionalNumber, validateMongoObjectId } from '../_helpers'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IPatchRoomTypePayload } from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchRoomTypePayloadValidator(request: NowRequest): Promise<IPatchRoomTypePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPatchRoomTypePayload = {}

  const ALLOWED_PROPS: Array<keyof IPatchRoomTypePayload> = [
    'hotelId',
    'type',
    'quantity',
    'price',
    'amenities',
    'imageUrl',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPatchRoomTypePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'roomType' is not updatable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateMongoObjectId('hotelId', hotelId)
  await validateOptionalString('hotelId', hotelId)
  if (typeof hotelId !== 'undefined') payload.hotelId = hotelId

  const type = request.body.type
  await validateOptionalString('type', type)
  if (typeof type !== 'undefined') payload.type = type

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
  payload.imageUrl = imageUrl

  return payload
}

export {
  patchRoomTypePayloadValidator,
}
