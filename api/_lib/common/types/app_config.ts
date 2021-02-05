import { ObjectID } from 'mongodb'

type TAppConfigDbDataFields =
  | '_id'
  | 'key'
  | 'value'
  | 'encrypted'

type IAppConfigDbDataProjection = {
  [key in TAppConfigDbDataFields]?: 1
}

interface IBaseAppConfig {
  key: string
  value: string
  encrypted: boolean
}

interface IAppConfig extends IBaseAppConfig {
  id: string
}

type IAppConfigCollection = Array<IAppConfig>

interface IBaseAppConfigDbData {
  key: string
  value: string
  encrypted: boolean
}

interface IAppConfigDbData extends IBaseAppConfigDbData {
  _id: ObjectID|null
}

type IAppConfigCollectionDbData = Array<IAppConfigDbData>

interface IAppConfigHash {
  SENDGRID_CALLBACK_URL: string
  SENDGRID_API_KEY: string

  WT_VERIFICATION_CODE: string
  WT_THEGRAPH_API_URL: string
  WT_ROOMS_ORGID: string
  WT_SIMARD_ORGID: string
  WT_SIMARD_API_URL: string

  WT_ROOMS_PRIVATE_KEY: string
  WT_ROOMS_PRIVATE_KEY_FRAGMENT: string

  API_TEST_ENABLED: string
  API_TEST_ONE_TIME_PASSWORD: string
  API_TEST_SESSION_TOKEN: string

  ENABLE_LOGIN_WITHOUT_SENDGRID: string

  ONE_MONGO_CONNECTION_PER_REQUEST: string
}

export {
  TAppConfigDbDataFields,
  IAppConfigDbDataProjection,
  IBaseAppConfig,
  IAppConfig,
  IAppConfigCollection,
  IBaseAppConfigDbData,
  IAppConfigDbData,
  IAppConfigCollectionDbData,
  IAppConfigHash,
}
