import { AppConfig } from '../../_lib/infra/config'
import { CError } from '../../_lib/tools'
import { IAppConfig } from '../../_lib/types'
import { CONSTANTS } from '../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function checkRequiredAppConfigProps(): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  const requiredAppConfigProps: Array<keyof IAppConfig> = [
    'SENDGRID_CALLBACK_URL',
    'SENDGRID_API_KEY',

    'WT_VERIFICATION_CODE',
    'WT_THEGRAPH_API_URL',
    'WT_ROOMS_ORGID',
    'WT_SIMARD_ORGID',
    'WT_SIMARD_API_URL',

    'WT_ROOMS_PRIVATE_KEY',

    'API_TEST_ENABLED',
    'API_TEST_ONE_TIME_PASSWORD',
    'API_TEST_SESSION_TOKEN',

    'ENABLE_LOGIN_WITHOUT_SENDGRID',

    'ONE_MONGO_CONNECTION_PER_REQUEST',
  ]

  for (let c1 = 0; c1 < requiredAppConfigProps.length; c1 += 1) {
    const prop: keyof IAppConfig = requiredAppConfigProps[c1]

    if (typeof appConfig[prop] !== 'string' || appConfig[prop] === '') {
      throw new CError(INTERNAL_SERVER_ERROR, `AppConfig variable '${prop}' is not set.`)
    }
  }
}

export {
  checkRequiredAppConfigProps,
}
