import { NowRequest, NowResponse } from '@vercel/node'

import { checkIfUserAuthenticated } from '../app'
import { genericApiMethodHandler, errorHandler } from '../tools'
import { checkLogin } from '../validators'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await checkLogin(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  try {
    await checkIfUserAuthenticated(email, oneTimePassword, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ email, oneTimePassword, sessionToken })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
