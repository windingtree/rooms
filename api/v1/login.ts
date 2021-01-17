// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../_lib/interface'
import { postLoginPayloadValidator } from '../_lib/interface/validators'

// application layer imports
import { authenticateClientAppUser } from '../_lib/app/auth/client_app'

// common imports
import { IProfile, IProfileAuthData } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IProfile> {
  const payload: IProfileAuthData = await postLoginPayloadValidator(request)

  return await authenticateClientAppUser(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
