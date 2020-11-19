import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppUser } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { postLoginPayloadValidator } from '../_lib/validators'
import { IProfile, IProfileAuthData } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let payload: IProfileAuthData
  try {
    payload = await postLoginPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await authenticateClientAppUser(payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
