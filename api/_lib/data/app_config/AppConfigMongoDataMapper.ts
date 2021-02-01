import { BaseMongoDataMapper } from '../../common/tools'
import {
  IBaseAppConfigDbData,
  IAppConfigDbData,
  IAppConfigCollectionDbData,

  IBaseAppConfig,
  IAppConfig,
  IAppConfigCollection,
} from '../../common/types'

class AppConfigMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseAppConfig: IBaseAppConfig): IBaseAppConfigDbData {
    return {
      key: baseAppConfig.key,
      value: baseAppConfig.value,
      encrypted: baseAppConfig.encrypted,
    }
  }

  toBaseEntity(baseAppConfigDbData: IBaseAppConfigDbData): IBaseAppConfig {
    return {
      key: baseAppConfigDbData.key,
      value: baseAppConfigDbData.value,
      encrypted: baseAppConfigDbData.encrypted,
    }
  }

  fromEntity(appConfig: IAppConfig): IAppConfigDbData {
    return Object.assign({ _id: this.toObjectId(appConfig.id) }, this.fromBaseEntity(appConfig))
  }

  toEntity(appConfigDbData: IAppConfigDbData): IAppConfig {
    return Object.assign({ id: this.fromObjectId(appConfigDbData._id) }, this.toBaseEntity(appConfigDbData))
  }

  fromEntityCollection(appConfigCollection: IAppConfigCollection): IAppConfigCollectionDbData {
    return appConfigCollection.map((appConfig: IAppConfig): IAppConfigDbData => {
      return this.fromEntity(appConfig)
    })
  }

  toEntityCollection(appConfigCollectionDbData: IAppConfigCollectionDbData): IAppConfigCollection {
    return appConfigCollectionDbData.map((appConfigDbData: IAppConfigDbData): IAppConfig => {
      return this.toEntity(appConfigDbData)
    })
  }
}

export { AppConfigMongoDataMapper }
