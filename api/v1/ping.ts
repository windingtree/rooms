import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../_lib/interface'

async function GET(): Promise<string> {
  return 'OK'
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET }, true)
}
