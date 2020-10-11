import { NowRequest, NowResponse } from '@vercel/node'

import { API_HOST_URL } from './tools/constants'
import { genericApiMethodHandler } from './tools/generic_api_method_handler'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.redirect(307, `https://${API_HOST_URL}/api/doc`)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
