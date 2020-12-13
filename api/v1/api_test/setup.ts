import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, apiTestSetup } from '../../_lib/app/api_test'
import { genericApiMethodHandler } from '../../_lib/tools'
import { IProfile } from '../../_lib/types'

async function POST(request: NowRequest): Promise<IProfile> {
  await authenticateApiTestRequest(request)

  return await apiTestSetup()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
