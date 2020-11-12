import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, errorHandler, authenticateUser } from '../tools'
import { checkLogin } from '../validators'
import { IProfileAuth } from '../types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await checkLogin(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  let profileAuth: IProfileAuth
  try {
    profileAuth = await authenticateUser(email, oneTimePassword, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profileAuth)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
