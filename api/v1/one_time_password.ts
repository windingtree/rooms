import { NowRequest, NowResponse } from '@vercel/node'

import { getClientAppOneTimePassword } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler, emailOneTimePassword } from '../_lib/tools'
import { AppConfig } from '../_lib/infra/config'
import { postOneTimePasswordPayloadValidator } from '../_lib/validators'
import { IOneTimePasswordPayload } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let appConfig
  try {
    appConfig = await AppConfig.getInstance().getConfig()
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IOneTimePasswordPayload
  try {
    payload = await postOneTimePasswordPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let oneTimePassword: string
  try {
    oneTimePassword = await getClientAppOneTimePassword(payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await emailOneTimePassword(payload.email, oneTimePassword)
  } catch (err) {
    return errorHandler(response, err)
  }

  if (appConfig.ENABLE_LOGIN_WITHOUT_SENDGRID === 'true') {
    response.status(200).json({ email: payload.email, oneTimePassword })
  } else {
    response.status(200).json({ email: payload.email, oneTimePassword: 'sent' })
  }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
