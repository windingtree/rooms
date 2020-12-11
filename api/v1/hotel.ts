import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { createHotel } from '../_lib/app/hotel'
import { genericApiMethodHandler, authorizeRequest } from '../_lib/tools'
import { postHotelPayloadValidator } from '../_lib/validators'
import { IProfile, IHotel, IPostHotelPayload } from '../_lib/types'

async function POST(request: NowRequest): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'hotel' })

  const payload: IPostHotelPayload = await postHotelPayloadValidator(request)

  return await createHotel(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
