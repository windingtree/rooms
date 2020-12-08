import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, apiTestSetup } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler } from '../../_lib/tools'
import { IProfile } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IProfile> {
  await authenticateApiTestRequest(request)

  await apiTestSetup()

  const result: IProfile = await authenticateClientAppRequest(request)

  return result
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
