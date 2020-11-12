import { NowRequest, NowResponse } from '@vercel/node'

import { createHotel } from '../app'
import { getUserAuthDetails, genericApiMethodHandler, errorHandler, authorizeUser } from '../tools'
import { hotelPostValidator } from '../validators'
import { IProfileAuth, IHotel, IHotelPostData } from '../types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profileAuth: IProfileAuth
  try {
    profileAuth = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profileAuth, 'POST', 'hotel')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IHotelPostData
  try {
    data = await hotelPostValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotel: IHotel
  try {
    hotel = await createHotel(Object.assign({}, { ownerId: profileAuth.id }, data))
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(hotel)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
