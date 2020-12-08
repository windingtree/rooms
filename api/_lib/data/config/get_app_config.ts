import { CError, decryptText } from '../../../_lib/tools'
import { IAppConfig, IAppConfigDbItem } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { ENV } from '../../../_lib/infra/env'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function getAppConfig(): Promise<IAppConfig> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const appConfig: IAppConfig = {
    SENDGRID_CALLBACK_URL: '',
    SENDGRID_API_KEY: '',

    WT_VERIFICATION_CODE: '',
    WT_THEGRAPH_API_URL: '',
    WT_ROOMS_ORGID: '',
    WT_SIMARD_ORGID: '',
    WT_SIMARD_API_URL: '',

    WT_ROOMS_PRIVATE_KEY: '',

    API_TEST_ENABLED: '',
    API_TEST_EMAIL: '',
    API_TEST_ONE_TIME_PASSWORD: '',
    API_TEST_SESSION_TOKEN: '',

    ENABLE_LOGIN_WITHOUT_SENDGRID: '',
  }

  let decryptOk = true

  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('app_config')

    const query = {}

    const options = {
      projection: {
        _id: 0,
        key: 1,
        value: 1,
        encrypted: 1,
      },
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return appConfig
    }

    await cursor.forEach((item: IAppConfigDbItem) => {
      let value = item.value

      try {
        if (item.encrypted === true) {
          value = decryptText(ENV.APP_ENV_ENCRYPTION_DETAILS, value)
        }
      } catch (err) {
        decryptOk = false
      }

      appConfig[item.key] = value
    })
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, 'Something went wrong while getting app config.')
  }

  if (!decryptOk) {
    throw new CError(INTERNAL_SERVER_ERROR, 'Could not decrypt AppConfig items.')
  }

  return appConfig
}

export {
  getAppConfig,
}
