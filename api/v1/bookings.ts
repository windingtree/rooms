// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllBookings } from '../_lib/app/booking'

// common imports
import { IProfile, IBookingCollection } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IBookingCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'bookings' })

  return await getAllBookings(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
