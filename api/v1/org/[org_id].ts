import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { getOrgDetails } from '../../_lib/data/marketplace'
import { genericApiMethodHandler, getQueryParamValue, errorHandler } from '../../_lib/tools'
import { IOrgDetails } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let orgId: string
  try {
    orgId = getQueryParamValue(request, 'org_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let orgDetails: IOrgDetails
  try {
    orgDetails = await getOrgDetails(orgId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ orgId, details: orgDetails.organization })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
