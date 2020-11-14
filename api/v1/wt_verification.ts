import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { AppConfig } from '../_lib/infra/config'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let appConfig
  try {
    appConfig = await AppConfig.getInstance().getConfig()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).send(appConfig.WT_VERIFICATION_CODE)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
