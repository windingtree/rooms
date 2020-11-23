import { NowRequest, NowResponse } from '@vercel/node'

import { getRoomType, updateRoomType, deleteRoomType } from '../../_lib/app/room_type'
import { genericApiMethodHandler, errorHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchRoomTypePayloadValidator } from '../../_lib/validators'
import { IProfile, IRoomType, IPatchRoomTypePayload } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'room_type/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomTypeId: string
  try {
    roomTypeId = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IRoomType
  try {
    result = await getRoomType(requester, roomTypeId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'PATCH', route: 'room_type/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomTypeId: string
  try {
    roomTypeId = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IPatchRoomTypePayload
  try {
    data = await patchRoomTypePayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IRoomType
  try {
    result = await updateRoomType(requester, roomTypeId, data)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'DELETE', route: 'room_type/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomTypeId: string
  try {
    roomTypeId = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteRoomType(requester, roomTypeId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deletedCount: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
