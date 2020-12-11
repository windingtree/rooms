import { MongoDB } from '../../_lib/infra/mongo'
import { IExitHandlerOptions } from '../../_lib/types'

async function exit(options: IExitHandlerOptions, code: number): Promise<void> {
  if (!options.exit) {
    return
  }

  const instance = MongoDB.getInstance()
  if (instance.isConnected()) {
    const dbClient = await instance.getDbClient()
    await dbClient.close()
  }

  process.exit(code)
}

async function exitHandler(options: IExitHandlerOptions, signal: string|number|Error): Promise<void> {
  if (options.cleanup) {
    console.log('exitHandler :: cleanup')
  } else if (options.exit) {
    console.log('exitHandler :: exit')
  }

  if (typeof signal === 'string' || typeof signal === 'number') {
    console.log(signal)
    await exit(options, 0)
  } else {
    console.error(signal)
    await exit(options, 1)
  }
}

function listenToExitSignals(): void {
  // Do something when app is closing.
  process.on('exit', exitHandler.bind(null, { cleanup: true }))

  // Catches ctrl+c event.
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))

  // Catches 'kill pid' (for example: nodemon restart).
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

  // Catches uncaught exceptions.
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

export {
  listenToExitSignals,
}
