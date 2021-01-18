import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString } from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPostBookingPayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postBookingPayloadValidator(request: NowRequest): Promise<IPostBookingPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostBookingPayload = {
    hotelId: '',
    checkInDate: '',
    checkOutDate: '',
    guestName: '',
    guestEmail: '',
    phoneNumber: '',
    roomTypeId: '',
  }

  const ALLOWED_PROPS: Array<keyof IPostBookingPayload> = [
    'hotelId',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestEmail',
    'phoneNumber',
    'roomTypeId',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostBookingPayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'booking' is not updatable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateRequiredString('hotelId', hotelId)
  payload.hotelId = hotelId

  const checkInDate = request.body.checkInDate
  await validateOptionalString('checkInDate', checkInDate)
  payload.checkInDate = checkInDate

  const checkOutDate = request.body.checkOutDate
  await validateOptionalString('checkOutDate', checkOutDate)
  payload.checkOutDate = checkOutDate

  const guestName = request.body.guestName
  await validateOptionalString('guestName', guestName)
  payload.guestName = guestName

  const guestEmail = request.body.guestEmail
  await validateOptionalString('guestEmail', guestEmail)
  payload.guestEmail = guestEmail

  const phoneNumber = request.body.phoneNumber
  await validateOptionalString('phoneNumber', phoneNumber)
  payload.phoneNumber = phoneNumber

  const roomTypeId = request.body.roomTypeId
  await validateOptionalString('roomTypeId', roomTypeId)
  payload.roomTypeId = roomTypeId

  return payload
}

export { postBookingPayloadValidator }
