import { getClientAppOneTimePassword } from '../../../../_lib/app/auth/client_app'
import { emailOneTimePassword } from '../../../../_lib/tools'
import { AppConfig } from '../../../../_lib/infra/config'
import { IOneTimePasswordPayload, IOtpStatus } from '../../../../_lib/types'

async function handleOneTimePassword(payload: IOneTimePasswordPayload): Promise<IOtpStatus> {
  const oneTimePassword: string = await getClientAppOneTimePassword(payload)

  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.ENABLE_LOGIN_WITHOUT_SENDGRID === 'true') {
    return { email: payload.email, oneTimePassword }
  } else {
    await emailOneTimePassword(payload.email, oneTimePassword)

    return { email: payload.email, oneTimePassword: 'sent' }
  }
}

export {
  handleOneTimePassword,
}
