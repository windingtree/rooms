import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, apiTestTearDown } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../../_lib/tools'
import { IProfile } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    authenticateApiTestRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await apiTestTearDown(requester)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ tear_down: 'OK' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
