import { NowRequest, NowResponse } from '@vercel/node'

import { handleOneTimePassword } from '../_lib/app/auth/client_app'
import { genericApiMethodHandler } from '../_lib/tools'
import { postOneTimePasswordPayloadValidator } from '../_lib/validators'
import { IOneTimePasswordPayload, IOtpStatus } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IOtpStatus> {
  const payload: IOneTimePasswordPayload = await postOneTimePasswordPayloadValidator(request)

  return await handleOneTimePassword(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
