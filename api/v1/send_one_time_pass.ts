import { NowRequest, NowResponse } from '@vercel/node'

import { getOneTimePassword } from '../app'
import { genericApiMethodHandler, errorHandler, emailOneTimePassword } from '../tools'
import { checkSendOneTimePass } from '../validators'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await checkSendOneTimePass(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const sessionToken: string = request.body.sessionToken

  let oneTimePassword: string
  try {
    oneTimePassword = await getOneTimePassword(email, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await emailOneTimePassword(email, oneTimePassword)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ email: email, oneTimePassword: 'sent' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
