// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { postBookingPayloadValidator } from '../_lib/interface/validators'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { createBooking } from '../_lib/app/booking'

// common imports
import { IProfile, IBooking, IPostBookingPayload } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'booking' })

  const payload: IPostBookingPayload = await postBookingPayloadValidator(request)

  return await createBooking(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
