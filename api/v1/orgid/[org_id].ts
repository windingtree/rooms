import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { getOrgDetails } from '../../_lib/app/orgid'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue, errorHandler } from '../../_lib/tools'
import { IOrgDetails, IProfile } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'orgid/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let orgId: string
  try {
    orgId = getQueryParamValue(request, 'org_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IOrgDetails
  try {
    result = await getOrgDetails(orgId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
