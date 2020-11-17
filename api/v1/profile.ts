import { NowRequest, NowResponse } from '@vercel/node'

import { createProfile } from '../_lib/app/profile'
import { authenticateClientAppRequest } from '../_lib/app/auth'
import { genericApiMethodHandler, authorizeRequest, errorHandler } from '../_lib/tools'
import { postProfilePayloadValidator } from '../_lib/validators'
import { IProfile, IPostProfilePayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'POST', route: 'profile' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPostProfilePayload
  try {
    payload = await postProfilePayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await createProfile(requester, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
