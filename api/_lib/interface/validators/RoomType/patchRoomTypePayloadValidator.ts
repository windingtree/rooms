// node/npm imports
import { NowRequest } from '@vercel/node'

// interface layer imports
import { validateOptionalString, validateOptionalNumber, validateMongoObjectId } from '../../validators/_helpers'

// common imports
import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPatchRoomTypePayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchRoomTypePayloadValidator(request: NowRequest): Promise<IPatchRoomTypePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPatchRoomTypePayload = {}

  const ALLOWED_PROPS: Array<keyof IPatchRoomTypePayload> = [
    'hotelId',
    'type',
    'description',
    'quantity',
    'price',
    'devConPrice',
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

  const description = request.body.description
  await validateOptionalString('description', description)
  if (typeof description !== 'undefined') payload.description = description

  const quantity = request.body.quantity
  await validateOptionalNumber('quantity', quantity)
  if (typeof quantity !== 'undefined') payload.quantity = quantity

  const price = request.body.price
  await validateOptionalNumber('price', price)
  if (typeof price !== 'undefined') payload.price = price

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

export { patchRoomTypePayloadValidator }
