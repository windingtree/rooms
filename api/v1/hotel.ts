// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { postHotelPayloadValidator } from '../_lib/interface/validators'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { createHotel } from '../_lib/app/hotel'

// common imports
import { IProfile, IHotel, IPostHotelPayload } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'hotel' })

  const payload: IPostHotelPayload = await postHotelPayloadValidator(request)

  return await createHotel(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
