import { NowRequest, NowResponse } from '@vercel/node'

import { createBooking } from '../_lib/app/Booking'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { postBookingPayloadValidator } from '../_lib/validators'
import { IProfile, IBooking, IPostBookingPayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'POST', route: 'booking' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPostBookingPayload
  try {
    payload = await postBookingPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IBooking
  try {
    result = await createBooking(requester, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
