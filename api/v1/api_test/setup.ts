import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, apiTestSetup } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../../_lib/tools'
import { IProfile } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateApiTestRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await apiTestSetup()
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
