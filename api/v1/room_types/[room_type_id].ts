import { NowRequest, NowResponse } from '@vercel/node'

import { getRoomType, updateRoomType, deleteRoomType } from '../../_lib/data/rooms'
import { authenticateRequest, genericApiMethodHandler, getQueryParamValue, errorHandler } from '../../_lib/tools'
import { checkRoomType } from '../../_lib/validators'
import { IProfile, IRoomType } from '../../_lib/types'

async function PUT(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await checkRoomType(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = profile.email

  const type: string = request.body.type
  const quantity: number = parseInt(request.body.quantity)
  const price: number = parseFloat(request.body.price)
  const amenities: string = request.body.amenities

  let roomType: IRoomType
  try {
    roomType = await updateRoomType(id, email, { type, quantity, price, amenities })
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomType: IRoomType
  try {
    roomType = await getRoomType(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteRoomType(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ id, deleted: true })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PUT, DELETE })
}
