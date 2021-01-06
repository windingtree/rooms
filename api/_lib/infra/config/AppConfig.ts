import { getAppConfig as getAppConfigData } from '../../../_lib/data/config'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IAppConfig } from '../../../_lib/types'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

class AppConfig {
  private static _instance: AppConfig = new AppConfig()
  private _appConfig: IAppConfig|null = null

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
      this._appConfig = await getAppConfigData()
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not get AppConfig from the database.', err)
    }

    console.log('[AppConfig :: createAppConfig] => AppConfig data loaded.')
  }

  public static getInstance(): AppConfig {
    return AppConfig._instance
  }

  public async getConfig(): Promise<IAppConfig> {
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
}

export {
  AppConfig,
}
