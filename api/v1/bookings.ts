import { NowRequest, NowResponse } from '@vercel/node'

import { getAllBookings } from '../_lib/app/Booking'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { IProfile, IBookingCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IBookingCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'bookings' })

  return await getAllBookings(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
