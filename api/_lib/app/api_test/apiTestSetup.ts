import { v4 as uuidv4 } from 'uuid'

import { AppConfig } from '../../app/config'

import { ProfileRepo } from '../../data/profile/ProfileRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IBaseProfile, IProfile } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE
const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

const profileRepo = new ProfileRepo()

async function apiTestSetup(): Promise<IProfile> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const baseProfile: IBaseProfile = {
    email: `${uuidv4()}@test.com`,
    name: '',
    phone: '',
    oneTimePassword: appConfig.API_TEST_ONE_TIME_PASSWORD,
    sessionToken: appConfig.API_TEST_SESSION_TOKEN,
    role: SUPER_ADMIN,
    hotelId: '',
  }

  const profileId: string = await profileRepo.createProfile(baseProfile)
  const profile: IProfile = Object.assign({}, baseProfile, { id: profileId })

  return profile
}

export { apiTestSetup }
