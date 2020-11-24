import { getAppConfig } from '../../../_lib/data/config'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IAppConfig } from '../../../_lib/types'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

class AppConfig {
  private static _instance: AppConfig = new AppConfig()
  private _config: IAppConfig|null = null

  constructor() {
    if (AppConfig._instance) {
      throw new CError(
        INTERNAL_SERVER_ERROR,
        'AppConfig class instantiation failed. Use AppConfig.getInstance() instead of new operator.'
      )
    }
    AppConfig._instance = this
  }

  public static getInstance(): AppConfig {
    return AppConfig._instance
  }

  private async createConfig(): Promise<void> {
    if (this._config) {
      return
    }

    try {
      this._config = await getAppConfig()
    } catch (err) {
      this._config = null
      return
    }
  }

  public async getConfig(): Promise<IAppConfig> {
    await AppConfig._instance.createConfig()

    if (this._config === null) {
      throw new CError(BAD_GATEWAY, 'Could not get AppConfig from the database.')
    }

    return this._config
  }
}

export {
  AppConfig,
}
