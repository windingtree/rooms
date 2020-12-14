import { MongoClient, MongoClientOptions } from 'mongodb'

import { CError } from '../../../_lib/tools'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

class MongoDB {
  private static _instance: MongoDB = new MongoDB()
  private _dbClient: MongoClient|null = null
  private _dbClientOptions: MongoClientOptions

  constructor() {
    if (MongoDB._instance) {
      throw new CError(INTERNAL_SERVER_ERROR, 'MongoDB class instantiation failed. Use MongoDB.getInstance() instead of new operator.')
    }
    MongoDB._instance = this

    this._dbClientOptions = {
        // Enables the new unified topology layer.
        useUnifiedTopology: true,

        // TCP Connection timeout setting.
        connectTimeoutMS: 15000,

        // The number of milliseconds to wait before initiating keepAlive on the TCP socket.
        keepAliveInitialDelay: 15000,
    }
  }

  public static getInstance(): MongoDB {
    return MongoDB._instance
  }

  private async createDbConnection(): Promise<void> {
    if (this._dbClient) {
      return
    }

    try {
      this._dbClient = new MongoClient(ENV.MONGODB_URL, this._dbClientOptions)
      await this._dbClient.connect()
    } catch (err) {
      this._dbClient = null
    }

    if (this._dbClient !== null) {
      console.log('[MongoDB :: createDbConnection] => Mongo connection created.')
    }
  }

  public async getDbClient(): Promise<MongoClient> {
    await MongoDB._instance.createDbConnection()

    if (this._dbClient === null) {
      throw new CError(BAD_GATEWAY, 'Could not connect to the database.')
    }

    return this._dbClient
  }

  public async cleanUp(): Promise<void> {
    if (this._dbClient === null) {
      return
    }

    try {
      await this._dbClient.close()
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not close connection to the database.', err)
    }

    this._dbClient = null

    console.log('[MongoDB :: cleanUp] => Mongo connection closed.')
  }
}

export {
  MongoDB,
}
