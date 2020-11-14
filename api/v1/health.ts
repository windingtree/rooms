import { NowRequest, NowResponse } from '@vercel/node'

import { pingDatabase } from '../_lib/data/rooms'
import { genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { ENV } from '../_lib/infra/env'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await pingDatabase()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ db: 'up', app_version: ENV.APP_VERSION })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
