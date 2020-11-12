import { NowRequest, NowResponse } from '@vercel/node'

import { createRoomType, getRoomTypes } from '../app/rooms'
import { getUserAuthDetails, genericApiMethodHandler, errorHandler } from '../tools'
import { checkRoomType } from '../validators'
import { IProfileAuth, IRoomType, IRoomTypeCollection } from '../types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profileAuth: IProfileAuth
  try {
    profileAuth = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomCollection: IRoomTypeCollection
  try {
    roomCollection = await getRoomTypes(profileAuth.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profileAuth: IProfileAuth
  try {
    profileAuth = await getUserAuthDetails(request)
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
    roomType = await createRoomType(profileAuth.email, { type, quantity, price, amenities })
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, POST })
}
