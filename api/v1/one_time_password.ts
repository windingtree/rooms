import { NowRequest, NowResponse } from '@vercel/node'

import { getClientAppOneTimePassword } from '../_lib/app/auth'
import { genericApiMethodHandler, emailOneTimePassword } from '../_lib/tools'
import { AppConfig } from '../_lib/infra/config'
import { postOneTimePasswordPayloadValidator } from '../_lib/validators'
import { IOneTimePasswordPayload, IOtpStatus } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IOtpStatus> {
  const payload: IOneTimePasswordPayload = await postOneTimePasswordPayloadValidator(request)

  const oneTimePassword: string = await getClientAppOneTimePassword(payload)

  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.ENABLE_LOGIN_WITHOUT_SENDGRID === 'true') {
    return { email: payload.email, oneTimePassword }
  } else {
    await emailOneTimePassword(payload.email, oneTimePassword)

    return { email: payload.email, oneTimePassword: 'sent' }
  }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
