import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from './tools'
import { API_DOC_URL } from './constants'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.redirect(307, `${API_DOC_URL}/doc`)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
