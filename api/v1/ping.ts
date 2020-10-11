import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../tools'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.status(200).send('OK')
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
