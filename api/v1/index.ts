import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../_lib/tools'
import { ENV } from '../_lib/infra/env'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.redirect(307, `${ENV.API_DOC_URL}/doc`)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
