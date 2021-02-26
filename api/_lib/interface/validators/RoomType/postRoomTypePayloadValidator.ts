import { NowRequest } from '@vercel/node'

import {
  validateOptionalString,
  validateOptionalNumber,
  validateRequiredString,
} from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPostRoomTypePayload } from '../../../common/types'

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
    'currency',
    'devConPrice',
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

  const currency = request.body.currency
  await validateOptionalString('currency', currency)
  if (typeof currency !== 'undefined') payload.currency = currency

  const devConPrice = request.body.devConPrice
  await validateOptionalNumber('devConPrice', devConPrice)
  if (typeof devConPrice !== 'undefined') payload.devConPrice = devConPrice

  const amenities = request.body.amenities
  await validateOptionalString('amenities', amenities)
  if (typeof amenities !== 'undefined') payload.amenities = amenities

  const imageUrl = request.body.imageUrl
  await validateOptionalString('imageUrl', imageUrl)
  if (typeof imageUrl !== 'undefined') payload.imageUrl = imageUrl

  return payload
}

export { postRoomTypePayloadValidator }
