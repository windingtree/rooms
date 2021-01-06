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
      throw new CError(
        INTERNAL_SERVER_ERROR,
        'MongoDB class instantiation failed. Use MongoDB.getInstance() instead of new operator.'
      )
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

  private async createDbClient(): Promise<void> {
    if (this._dbClient) {
      return
    }

    try {
      this._dbClient = new MongoClient(ENV.MONGODB_URL, this._dbClientOptions)
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not create a new MongoClient instance.', err)
    }

    try {
      await this._dbClient.connect()
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not connect to the database.', err)
    }

    console.log('[MongoDB :: createDbClient] => Mongo connection created.')
  }

  public static getInstance(): MongoDB {
    return MongoDB._instance
  }

  public async getDbClient(): Promise<MongoClient> {
    await this.createDbClient()

    if (this._dbClient === null) {
      throw new CError(INTERNAL_SERVER_ERROR, 'DbClient = null, this should not happen.')
    }

    return this._dbClient
  }

  public async ping(): Promise<void> {
    const dbClient = await this.getDbClient()

    try {
      await dbClient.db().admin().ping()
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not complete ping() operation on the MongoDB.', err)
    }
  }

  public async cleanUp(): Promise<void> {
    if (!this._dbClient) {
      return
    }

    try {
      await this._dbClient.close()
      this._dbClient = null
    } catch (err: unknown) {
      throw new CError(BAD_GATEWAY, 'Could not close connection to the database.', err)
    }

    console.log('[MongoDB :: cleanUp] => Mongo connection closed.')
  }
}

export {
  MongoDB,
}
