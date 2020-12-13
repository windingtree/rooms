import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllHotels } from '../_lib/app/hotel'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { IProfile, IHotelCollection } from '../_lib/types'

async function GET(request: NowRequest): Promise<IHotelCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'hotels' })

  return await getAllHotels(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
