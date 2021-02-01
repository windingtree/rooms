import { AppConfigRepo } from '../../data/app_config/AppConfigRepo'

import { CONSTANTS } from '../../common/constants'
import { ENV } from '../../common/env'
import { CError, decryptText } from '../../common/tools'
import { IAppConfig, IAppConfigCollection, IAppConfigHash } from '../../common/types'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

const appConfigRepo = new AppConfigRepo()

class AppConfig {
  private static _instance: AppConfig = new AppConfig()
  private _appConfig: IAppConfigHash|null = null

  constructor() {
    if (AppConfig._instance) {
      throw new CError(
        INTERNAL_SERVER_ERROR,
        'AppConfig class instantiation failed. Use AppConfig.getInstance() instead of new operator.'
      )
    }
    AppConfig._instance = this
  }

  private async createAppConfig(): Promise<void> {
    if (this._appConfig) {
      return
    }

    try {
      const appConfigs = await appConfigRepo.readAppConfigs()

      this._appConfig = await this.createAppConfigHash(appConfigs)
    } catch (err: unknown) {
      this._appConfig = null

      throw new CError(BAD_GATEWAY, 'Could not get AppConfig from the database.', err)
    }

    console.log('[AppConfig :: createAppConfig] => AppConfig data loaded.')
  }

  private async createAppConfigHash(appConfigs: IAppConfigCollection): Promise<IAppConfigHash> {
    const appConfig: IAppConfigHash = {
      SENDGRID_CALLBACK_URL: '',
      SENDGRID_API_KEY: '',

      WT_VERIFICATION_CODE: '',
      WT_THEGRAPH_API_URL: '',
      WT_ROOMS_ORGID: '',
      WT_SIMARD_ORGID: '',
      WT_SIMARD_API_URL: '',

      WT_ROOMS_PRIVATE_KEY: '',

      API_TEST_ENABLED: '',
      API_TEST_ONE_TIME_PASSWORD: '',
      API_TEST_SESSION_TOKEN: '',

      ENABLE_LOGIN_WITHOUT_SENDGRID: '',

      ONE_MONGO_CONNECTION_PER_REQUEST: '',
    }

    let decryptOk = true
    let decryptError: unknown|null = null

    console.log('')
    console.log('=============== appConfigs ===============')
    console.log('')
    appConfigs.forEach((item: IAppConfig) => {
      let value = item.value

      try {
        if (item.encrypted === true) {
          value = decryptText(ENV.ENV_ENCRYPTION_DETAILS, value)
        }
      } catch (err: unknown) {
        decryptOk = false
        decryptError = err
      }

      const key: keyof IAppConfigHash = item.key as keyof IAppConfigHash
      appConfig[key] = value

      console.log(`key = ${key}; value = ${value}.`)
    })
    console.log('')
    console.log('=============== done ===============')
    console.log('')

    if (!decryptOk) {
      throw new CError(INTERNAL_SERVER_ERROR, 'Could not decrypt AppConfig items.', decryptError)
    }

    return appConfig
  }

  public static getInstance(): AppConfig {
    return AppConfig._instance
  }

  public async getConfig(): Promise<IAppConfigHash> {
    await this.createAppConfig()

    if (this._appConfig === null) {
      throw new CError(INTERNAL_SERVER_ERROR, 'AppConfig = null, this should not happen.')
    }

    return this._appConfig
  }

  public async cleanUp(): Promise<void> {
    this._appConfig = null

    console.log('[AppConfig :: cleanUp] => AppConfig data cleared.')
  }

  public async validate(): Promise<void> {
    const requiredAppConfigProps: Array<keyof IAppConfigHash> = [
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

    if (this._appConfig === null) {
      throw new CError(INTERNAL_SERVER_ERROR, `AppConfig is not loaded.`)
    }

    for (let c1 = 0; c1 < requiredAppConfigProps.length; c1 += 1) {
      const prop: keyof IAppConfigHash = requiredAppConfigProps[c1]

      if (typeof this._appConfig[prop] !== 'string' || this._appConfig[prop] === '') {
        throw new CError(INTERNAL_SERVER_ERROR, `AppConfig variable '${prop}' is not set.`)
      }
    }
  }
}

export { AppConfig }
