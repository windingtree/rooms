// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { postProfilePayloadValidator } from '../_lib/interface/validators'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { createProfile } from '../_lib/app/profile'

// common imports
import { IProfile, IPostProfilePayload } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IProfile> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'profile' })

  const payload: IPostProfilePayload = await postProfilePayloadValidator(request)

  return await createProfile(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
