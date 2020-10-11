import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from './tools'
import { API_HOST_URL } from './constants'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.redirect(307, `https://${API_HOST_URL}/api/doc`)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
