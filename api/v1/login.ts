import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppUser } from '../_lib/app/auth/client_app'
import { genericApiMethodHandler } from '../_lib/tools'
import { postLoginPayloadValidator } from '../_lib/validators'
import { IProfile, IProfileAuthData } from '../_lib/types'

async function POST(request: NowRequest): Promise<IProfile> {
  const payload: IProfileAuthData = await postLoginPayloadValidator(request)

  return await authenticateClientAppUser(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
