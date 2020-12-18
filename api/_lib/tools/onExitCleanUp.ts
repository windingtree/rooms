import { MongoDB } from '../../_lib/infra/mongo'
import { AppConfig } from '../../_lib/infra/config'
import { IAppConfig } from '../../_lib/types'

async function onExitCleanUp(): Promise<void> {
  const appConfig: IAppConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.ONE_MONGO_CONNECTION_PER_REQUEST === 'true') {
    await MongoDB.getInstance().cleanUp()
  }

  await AppConfig.getInstance().cleanUp()
}

export {
  onExitCleanUp,
}
