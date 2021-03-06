import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/interface'

import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { getOrgDetails } from '../../_lib/app/orgid'

import { IOrgDetails, IProfile } from '../../_lib/common/types'

async function GET(request: NowRequest): Promise<IOrgDetails> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'orgid/{id}' })

  const orgId: string = getQueryParamValue(request, 'org_id')

  return await getOrgDetails(orgId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
