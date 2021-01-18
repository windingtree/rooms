import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../../_lib/interface'

import { authenticateApiTestRequest, apiTestTearDown } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'

import { IProfile, IStatus } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IStatus> {
  await authenticateApiTestRequest(request)

  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'api_test/teardown' })

  return await apiTestTearDown(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
