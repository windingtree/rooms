import { AppConfig } from '../../../../_lib/infra/config'

async function wtVerification(): Promise<string> {
  const appConfig = await AppConfig.getInstance().getConfig()

  return appConfig.WT_VERIFICATION_CODE
}

export {
  wtVerification,
}
