import { NowRequest, NowResponse } from '@vercel/node'

import { createBooking } from '../_lib/app/Booking'
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { postBookingPayloadValidator } from '../_lib/validators'
import { IProfile, IBooking, IPostBookingPayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'booking' })

  const payload: IPostBookingPayload = await postBookingPayloadValidator(request)

  return await createBooking(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
