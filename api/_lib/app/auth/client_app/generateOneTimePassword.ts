// application layer imports
import { getClientAppOneTimePassword } from './'
import { AppConfig } from '../../../app/config'
import { emailOneTimePassword } from '../../../app/email'

// common imports
import { IOneTimePasswordPayload, IOtpStatus } from '../../../common/types'

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
