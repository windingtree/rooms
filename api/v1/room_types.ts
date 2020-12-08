import { NowRequest, NowResponse } from '@vercel/node'

import { getAllRoomTypes } from '../_lib/app/room_type'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { IProfile, IRoomTypeCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IRoomTypeCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'room_types' })

  return await getAllRoomTypes(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
