import { NowRequest, NowResponse } from '@vercel/node'

import { pingDatabase } from '../app/rooms'
import { genericApiMethodHandler, errorHandler } from '../tools'
import { APP_VERSION } from '../constants'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await pingDatabase()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ db: 'up', app_version: APP_VERSION })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
