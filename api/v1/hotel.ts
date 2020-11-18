import { NowRequest, NowResponse } from '@vercel/node'

import { createHotel } from '../_lib/app/hotel'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { postHotelPayloadValidator } from '../_lib/validators'
import { IProfile, IHotel, IPostHotelPayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'POST', route: 'hotel' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPostHotelPayload
  try {
    payload = await postHotelPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotel
  try {
    result = await createHotel(requester, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
