import { NowRequest, NowResponse } from '@vercel/node'

import { getRoomType, updateRoomType, deleteRoomType } from '../../_lib/app/room_type'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchRoomTypePayloadValidator } from '../../_lib/validators'
import { IProfile, IRoomType, IPatchRoomTypePayload, IStatus } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IRoomType> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'room_type/{id}' })

  const roomTypeId: string = getQueryParamValue(request, 'room_type_id')

  return await getRoomType(requester, roomTypeId)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<IRoomType> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'room_type/{id}' })

  const roomTypeId: string = getQueryParamValue(request, 'room_type_id')

  const data: IPatchRoomTypePayload = await patchRoomTypePayloadValidator(request)

  return await updateRoomType(requester, roomTypeId, data)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'room_type/{id}' })

  const roomTypeId: string = getQueryParamValue(request, 'room_type_id')

  await deleteRoomType(requester, roomTypeId)

  return { status: 'OK' }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
