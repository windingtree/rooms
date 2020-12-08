import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../_lib/tools'
import { AppConfig } from '../_lib/infra/config'

async function GET(request: NowRequest, response: NowResponse): Promise<string> {
  const appConfig = await AppConfig.getInstance().getConfig()

  return appConfig.WT_VERIFICATION_CODE
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
