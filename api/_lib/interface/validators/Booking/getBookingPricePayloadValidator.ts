import { NowRequest } from '@vercel/node'

import { validateRequiredString } from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IGetBookingPricePayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function getBookingPricePayloadValidator(request: NowRequest): Promise<IGetBookingPricePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IGetBookingPricePayload = {
    hotelId: '',
    roomTypeId: '',
    arrival: '',
    departure: '',
  }

  const ALLOWED_PROPS: Array<keyof IGetBookingPricePayload> = [
    'hotelId',
    'roomTypeId',
    'arrival',
    'departure',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IGetBookingPricePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'GET /booking_price' is not allowed.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateRequiredString('hotelId', hotelId)
  payload.hotelId = hotelId

  const roomTypeId = request.body.roomTypeId
  await validateRequiredString('roomTypeId', roomTypeId)
  payload.roomTypeId = roomTypeId

  const arrival = request.body.arrival
  await validateRequiredString('arrival', arrival)
  payload.arrival = arrival

  const departure = request.body.departure
  await validateRequiredString('departure', departure)
  payload.departure = departure

  return payload
}

export { getBookingPricePayloadValidator }
