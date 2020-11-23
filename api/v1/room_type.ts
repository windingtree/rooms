import { NowRequest, NowResponse } from '@vercel/node'

import { createRoomType } from '../_lib/app/room_type'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { postRoomTypePayloadValidator } from '../_lib/validators'
import { IProfile, IRoomType, IPostRoomTypePayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'POST', route: 'room_type' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPostRoomTypePayload
  try {
    payload = await postRoomTypePayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IRoomType
  try {
    result = await createRoomType(requester, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
