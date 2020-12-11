import { NowRequest, NowResponse } from '@vercel/node'

import { wtVerification } from '../_lib/app/auth/orgid'
import { genericApiMethodHandler } from '../_lib/tools'

async function GET(): Promise<string> {
  return await wtVerification()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
