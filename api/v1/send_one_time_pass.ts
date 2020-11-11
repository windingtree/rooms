import { NowRequest, NowResponse } from '@vercel/node'

import { getOneTimePassword } from '../app/rooms'
import { genericApiMethodHandler, errorHandler, emailOneTimePassword, AppConfig } from '../tools'
import { checkSendOneTimePass } from '../validators'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let appConfig
  try {
    appConfig = await AppConfig.getInstance().getConfig()
  } catch (err) {
    return errorHandler(response, err)
  }

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

  if (appConfig.ENABLE_LOGIN_WITHOUT_SENDGRID === 'true') {
    response.status(200).json({ email, oneTimePassword })
  } else {
    response.status(200).json({ email, oneTimePassword: 'sent' })
  }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
