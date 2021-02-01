import { AppConfig } from '../app/config'

import { MongoDB } from '../infra/mongo'

import { IAppConfigHash } from '../common/types'

async function onExitCleanUp(): Promise<void> {
  const appConfig: IAppConfigHash = await AppConfig.getInstance().getConfig()

  if (appConfig.ONE_MONGO_CONNECTION_PER_REQUEST === 'true') {
    await MongoDB.getInstance().cleanUp()
  }

  await AppConfig.getInstance().cleanUp()
}

export { onExitCleanUp }
