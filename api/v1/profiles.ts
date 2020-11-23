import { NowRequest, NowResponse } from '@vercel/node'

import { getAllProfiles } from '../_lib/app/profile'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, authorizeRequest } from '../_lib/tools'
import { IProfile, IProfileCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'profiles' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfileCollection
  try {
    result = await getAllProfiles(requester)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
