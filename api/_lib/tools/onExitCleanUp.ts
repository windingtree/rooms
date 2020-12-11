import { MongoDB } from '../../_lib/infra/mongo'

async function onExitCleanUp(): Promise<void> {
  await MongoDB.getInstance().cleanUp()
}

export {
  onExitCleanUp,
}
