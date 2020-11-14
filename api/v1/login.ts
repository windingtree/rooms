import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, errorHandler, authenticateUser } from '../_lib/tools'
import { checkLogin } from '../_lib/validators'
import { IProfile } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await checkLogin(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  let profile: IProfile
  try {
    profile = await authenticateUser(email, oneTimePassword, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profile)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
