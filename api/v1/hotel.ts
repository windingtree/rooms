import { NowRequest, NowResponse } from '@vercel/node'

import { createHotel } from '../_lib/data/hotel'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { hotelDataValidatorCreate } from '../_lib/validators'
import { IProfile, IHotel, IBaseHotel } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(profile.role, { method: 'POST', route: 'hotel' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IBaseHotel
  try {
    data = await hotelDataValidatorCreate(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotel
  try {
    result = await createHotel(data)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
