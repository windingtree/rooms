// application layer imports
import { AppConfig } from '../../../app/config'

async function wtVerification(): Promise<string> {
  const appConfig = await AppConfig.getInstance().getConfig()

  return appConfig.WT_VERIFICATION_CODE
}

export {
  wtVerification,
}
