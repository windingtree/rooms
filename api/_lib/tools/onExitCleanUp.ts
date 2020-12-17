import { MongoDB } from '../../_lib/infra/mongo'
import { CONSTANTS } from '../../_lib/infra/constants'

const { ONE_MONGO_CONNECTION_PER_REQUEST } = CONSTANTS

async function onExitCleanUp(): Promise<void> {
  if (ONE_MONGO_CONNECTION_PER_REQUEST === true) {
    await MongoDB.getInstance().cleanUp()
  }
}

export {
  onExitCleanUp,
}
