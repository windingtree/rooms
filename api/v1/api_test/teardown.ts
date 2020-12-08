import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, apiTestTearDown } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler } from '../../_lib/tools'
import { IProfile, IStatus } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IStatus> {
  await authenticateApiTestRequest(request)

  const requester: IProfile = await authenticateClientAppRequest(request)

  await apiTestTearDown(requester)

  const result: IStatus = { status: 'OK' }

  return result
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
