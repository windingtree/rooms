import { getClientAppOneTimePassword } from '../../../../_lib/app/auth/client_app'
import { emailOneTimePassword } from '../../../../_lib/tools'
import { AppConfig } from '../../../../_lib/infra/config'
import { IOneTimePasswordPayload, IOtpStatus } from '../../../../_lib/types'

async function generateOneTimePassword(payload: IOneTimePasswordPayload): Promise<IOtpStatus> {
  const oneTimePassword: string = await getClientAppOneTimePassword(payload)

  const appConfig = await AppConfig.getInstance().getConfig()

  const otpStatus: IOtpStatus = {
    email: payload.email,
    oneTimePassword: '',
  }

  if (appConfig.ENABLE_LOGIN_WITHOUT_SENDGRID === 'true') {
    otpStatus.oneTimePassword = oneTimePassword
  } else {
    await emailOneTimePassword(payload.email, oneTimePassword)
    otpStatus.oneTimePassword = 'sent'
  }

  return otpStatus
}

export {
  generateOneTimePassword,
}
