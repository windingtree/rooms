import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllBookings } from '../_lib/app/booking'

import { IProfile, IBookingCollection } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IBookingCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'bookings' })

  return await getAllBookings(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
