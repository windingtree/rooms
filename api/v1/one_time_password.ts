// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../_lib/interface'
import { postOneTimePasswordPayloadValidator } from '../_lib/interface/validators'

// application layer imports
import { generateOneTimePassword } from '../_lib/app/auth/client_app'

// common imports
import { IOneTimePasswordPayload, IOtpStatus } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IOtpStatus> {
  const payload: IOneTimePasswordPayload = await postOneTimePasswordPayloadValidator(request)

  return await generateOneTimePassword(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
