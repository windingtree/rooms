import { NowRequest, NowResponse } from '@vercel/node'

import { createRoomType } from '../_lib/app/room_type'
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { postRoomTypePayloadValidator } from '../_lib/validators'
import { IProfile, IRoomType, IPostRoomTypePayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IRoomType> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'room_type' })

  const payload: IPostRoomTypePayload = await postRoomTypePayloadValidator(request)

  return await createRoomType(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
