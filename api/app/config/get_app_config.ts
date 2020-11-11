import { DB, CError, disableApiRequestsHere } from '../../tools'
import { IAppConfig, IAppConfigDbItem } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function getAppConfig(): Promise<IAppConfig> {
  const dbClient = await DB.getInstance().getDbClient()

  const appConfig: IAppConfig = {
    SENDGRID_CALLBACK_URL: '',
    SENDGRID_API_KEY: '',

    WT_VERIFICATION_CODE: '',
    WT_THEGRAPH_API_URL: '',
    WT_ROOMS_ORGID: '',

    API_TEST_ENABLED: '',
    API_TEST_EMAIL: '',
    API_TEST_ONE_TIME_PASSWORD: '',
    API_TEST_SESSION_TOKEN: '',

    ENABLE_LOGIN_WITHOUT_SENDGRID: '',
  }

  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('app_config')

    const query = {}

    const options = {
      projection: {
        _id: 0,
        key: 1,
        value: 1,
      },
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return appConfig
    }

    await cursor.forEach((item: IAppConfigDbItem) => {
      appConfig[item.key] = item.value
    })
  } catch (err) {
    throw new CError(500, 'Something went wrong while getting app config.')
  }

  return appConfig
}

export {
  getAppConfig,
}
