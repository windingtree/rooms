import { NowRequest, NowResponse } from '@vercel/node'

import { apiTestReset } from '../app/rooms'
import { genericApiMethodHandler, errorHandler, CError } from '../tools'
import { IProfileData } from '../types'
import { API_TEST_ENABLED } from '../constants'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  if (API_TEST_ENABLED !== 'enabled') {
    return errorHandler(response, new CError(500, 'API test support not enabled for this environment.'))
  }

  let profileData: IProfileData
  try {
    profileData = await apiTestReset()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ reset: 'OK', profileData })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
