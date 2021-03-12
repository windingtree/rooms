import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { getBookingPricePayloadValidator } from '../_lib/interface/validators'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getBookingPrice } from '../_lib/app/booking'

import { IProfile, IBookingPrice, IGetBookingPricePayload } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IBookingPrice> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'room_types' })

  const payload: IGetBookingPricePayload = await getBookingPricePayloadValidator(request)

  return await getBookingPrice(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
