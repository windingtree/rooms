import { getAppConfig } from '../../data/config'
import { CError } from '../../tools'
import { IAppConfig } from '../../types'

class AppConfig {
  private static _instance: AppConfig = new AppConfig()
  private _config: IAppConfig|null = null

  constructor() {
    if (AppConfig._instance) {
      throw new CError(500, 'AppConfig class instantiation failed. Use AppConfig.getInstance() instead of new operator.')
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
      throw new CError(503, 'Could not connect to the database.')
    }

    return this._config
  }
}

export {
  AppConfig,
}
