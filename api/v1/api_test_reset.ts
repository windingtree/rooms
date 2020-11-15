import { NowRequest, NowResponse } from '@vercel/node'

import { apiTestReset } from '../_lib/data/rooms_legacy'
import { genericApiMethodHandler, errorHandler, CError } from '../_lib/tools'
import { AppConfig } from '../_lib/infra/config'
import { IProfile } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let appConfig
  try {
    appConfig = await AppConfig.getInstance().getConfig()
  } catch (err) {
    return errorHandler(response, err)
  }

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    return errorHandler(response, new CError(500, 'API test support not enabled for this environment.'))
  }

  let profile: IProfile
  try {
    profile = await apiTestReset()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ reset: 'OK', profile })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
