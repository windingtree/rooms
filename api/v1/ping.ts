import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../_lib/tools'

async function GET(request: NowRequest, response: NowResponse): Promise<string> {
  return 'OK'
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
