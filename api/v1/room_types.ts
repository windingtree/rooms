import { NowRequest, NowResponse } from '@vercel/node'

import { getAllRoomTypes } from '../_lib/app/room_type'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { IProfile, IRoomTypeCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'room_types' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IRoomTypeCollection
  try {
    result = await getAllRoomTypes(requester)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
