// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllRoomTypes } from '../_lib/app/room_type'

// common imports
import { IProfile, IRoomTypeCollection } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IRoomTypeCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'room_types' })

  return await getAllRoomTypes(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
