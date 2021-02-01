import { Collection } from 'mongodb'

import { MongoDB } from '../../infra/mongo'

import { ENV } from '../../common/env'
import { BaseDataRepo } from '../../common/tools'
import { TAppConfigDbDataFields, IAppConfigDbDataProjection, IAppConfigDbData } from '../../common/types'

import { readAppConfigs } from './functions'
import { AppConfigMongoDataMapper } from './AppConfigMongoDataMapper'

class AppConfigRepo extends BaseDataRepo {
  protected mapper = new AppConfigMongoDataMapper()

  public readAppConfigs = readAppConfigs

  constructor() {
    super()

    this.ENTITY_NAME = 'app_config'
    this.COLLECTION_NAME = 'app_config'
  }

  protected getProjection(): IAppConfigDbDataProjection {
    const allowedFields: Array<TAppConfigDbDataFields> = [
      '_id',
      'key',
      'value',
      'encrypted',
    ]

    return allowedFields.reduce((projection: IAppConfigDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IAppConfigDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export { AppConfigRepo }
