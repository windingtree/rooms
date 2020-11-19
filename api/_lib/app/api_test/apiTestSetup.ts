import { checkRequiredAppConfigProps } from './checkRequiredAppConfigProps'
import { createProfile } from '../../../_lib/data/profile'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import { IBaseProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE
const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

async function apiTestSetup(): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  checkRequiredAppConfigProps(appConfig)

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const profilePostData: IBaseProfile = {
    email: appConfig.API_TEST_EMAIL,
    name: '',
    phone: '',
    oneTimePassword: appConfig.API_TEST_ONE_TIME_PASSWORD,
    sessionToken: appConfig.API_TEST_SESSION_TOKEN,
    role: SUPER_ADMIN,
    hotelId: '',
  }

  await createProfile(profilePostData)
}

export {
  apiTestSetup,
}
