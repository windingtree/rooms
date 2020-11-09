import { NowRequest, NowResponse } from '@vercel/node'

import { getAllRoomTypes } from '../../app/rooms'
import { /* getUserAuthDetails,*/ genericApiMethodHandler, errorHandler } from '../../tools'
// import { checkRoomType } from '../validators'
import { /*IUserAuthDetails, IRoomType,*/ IRoomTypeCollection } from '../../types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  // let userAuthDetails: IUserAuthDetails
  // try {
  //   userAuthDetails = await getUserAuthDetails(request)
  // } catch (err) {
  //   return errorHandler(response, err)
  // }

  let roomCollection: IRoomTypeCollection
  try {
    roomCollection = await getAllRoomTypes()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomCollection)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
