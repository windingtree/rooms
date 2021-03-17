import { NowRequest } from '@vercel/node'

import {
  validateOptionalString,
  validateMongoObjectId,
  validateOptionalNumber
} from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPatchBookingPayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchBookingPayloadValidator(request: NowRequest): Promise<IPatchBookingPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPatchBookingPayload = {}

  const ALLOWED_PROPS: Array<keyof IPatchBookingPayload> = [
    'hotelId',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestEmail',
    'phoneNumber',
    'numberOfGuests',
    'roomTypeId',
    'price',
    'currency'
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPatchBookingPayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'booking' is not updatable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateMongoObjectId('hotelId', hotelId)
  await validateOptionalString('hotelId', hotelId)
  if (typeof hotelId !== 'undefined') payload.hotelId = hotelId

  const checkInDate = request.body.checkInDate
  await validateOptionalString('checkInDate', checkInDate)
  if (typeof checkInDate !== 'undefined') payload.checkInDate = checkInDate

  const checkOutDate = request.body.checkOutDate
  await validateOptionalString('checkOutDate', checkOutDate)
  if (typeof checkOutDate !== 'undefined') payload.checkOutDate = checkOutDate

  const guestName = request.body.guestName
  await validateOptionalString('guestName', guestName)
  if (typeof guestName !== 'undefined') payload.guestName = guestName

  const guestEmail = request.body.guestEmail
  await validateOptionalString('guestEmail', guestEmail)
  if (typeof guestEmail !== 'undefined') payload.guestEmail = guestEmail

  const phoneNumber = request.body.phoneNumber
  await validateOptionalString('phoneNumber', phoneNumber)
  if (typeof phoneNumber !== 'undefined') payload.phoneNumber = phoneNumber

  const numberOfGuests = request.body.numberOfGuests
  await validateOptionalNumber('numberOfGuests', numberOfGuests)
  if (typeof numberOfGuests !== 'undefined') payload.numberOfGuests = numberOfGuests

  const roomTypeId = request.body.roomTypeId
  await validateMongoObjectId('roomTypeId', roomTypeId)
  await validateOptionalString('roomTypeId', roomTypeId)
  if (typeof roomTypeId !== 'undefined') payload.roomTypeId = roomTypeId

  const currency = request.body.currency
  await validateOptionalString('currency', currency)
  if (typeof currency !== 'undefined') payload.currency = currency

  const price = request.body.price
  await validateOptionalNumber('price', price)
  if (typeof price !== 'undefined') payload.price = price

  return payload
}

export { patchBookingPayloadValidator }
