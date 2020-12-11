import { v4 as uuidv4 } from 'uuid'

import { createProfile } from '../../../_lib/data/profile'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import { IBaseProfile, IProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE
const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

async function apiTestSetup(): Promise<IProfile> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const profilePostData: IBaseProfile = {
    email: `${uuidv4()}@test.com`,
    name: '',
    phone: '',
    oneTimePassword: appConfig.API_TEST_ONE_TIME_PASSWORD,
    sessionToken: appConfig.API_TEST_SESSION_TOKEN,
    role: SUPER_ADMIN,
    hotelId: '',
  }

  const profileId: string = await createProfile(profilePostData)
  const profile: IProfile = Object.assign({}, profilePostData, { id: profileId })

  return profile
}

export {
  apiTestSetup,
}
