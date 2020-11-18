import { NowRequest, NowResponse } from '@vercel/node'

import { apiTestSetup } from '../../_lib/app/api_test'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, getQueryParamValue } from '../../_lib/tools'
import { IProfile } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profileRole: string
  try {
    profileRole = await getQueryParamValue(request, 'profileRole')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await apiTestSetup(profileRole)
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
