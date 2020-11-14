import { NowRequest, NowResponse } from '@vercel/node'

import { createProfile } from '../_lib/data'
import { authenticateRequest, genericApiMethodHandler, errorHandler, authorizeUser } from '../_lib/tools'
import { profileDataValidatorCreate } from '../_lib/validators'
import { IProfile, IBaseProfile } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profile.role, { method: 'POST', route: 'profile' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IBaseProfile
  try {
    data = await profileDataValidatorCreate(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await createProfile(data)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
