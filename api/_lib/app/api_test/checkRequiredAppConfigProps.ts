import { CError } from '../../../_lib/tools'
import { IAppConfig } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

function checkRequiredAppConfigProps(appConfig: IAppConfig): void {
  const requiredAppConfigProps: Array<keyof IAppConfig> = [
    'API_TEST_ENABLED',
    'API_TEST_EMAIL',
    'API_TEST_ONE_TIME_PASSWORD',
    'API_TEST_SESSION_TOKEN'
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