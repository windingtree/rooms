import { NowRequest, NowResponse } from '@vercel/node'

import { createRoomType, getRoomTypes } from '../_lib/data/rooms_legacy'
import { authenticateRequest, genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { checkRoomType } from '../_lib/validators'
import { IProfile, IRoomType, IRoomTypeCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomCollection: IRoomTypeCollection
  try {
    roomCollection = await getRoomTypes(profile.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await checkRoomType(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const type: string = request.body.type
  const quantity: number = parseInt(request.body.quantity)
  const price: number = parseFloat(request.body.price)
  const amenities: string = request.body.amenities

  let roomType: IRoomType
  try {
    roomType = await createRoomType(profile.email, { type, quantity, price, amenities })
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, POST })
}
