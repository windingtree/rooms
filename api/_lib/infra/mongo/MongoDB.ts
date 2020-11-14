import { MongoClient } from 'mongodb'

import { CError } from '../../tools'
import { ENV } from '../../infra/env'

class MongoDB {
  private static _instance: MongoDB = new MongoDB()
  private _dbClient: MongoClient|null = null

  constructor() {
    if (MongoDB._instance) {
      throw new CError(500, 'MongoDB class instantiation failed. Use MongoDB.getInstance() instead of new operator.')
    }
    MongoDB._instance = this
  }

  public static getInstance(): MongoDB {
    return MongoDB._instance
  }

  private async createDbConnection(): Promise<void> {
    if (this._dbClient) {
      return
    }

    try {
      this._dbClient = new MongoClient(ENV.MONGODB_URL, { useUnifiedTopology: true })
    } catch (err) {
      this._dbClient = null
      return
    }

    try {
      await this._dbClient.connect()
    } catch (err) {
      this._dbClient = null
      return
    }
  }

  public async getDbClient(): Promise<MongoClient> {
    await MongoDB._instance.createDbConnection()

    if (this._dbClient === null) {
      throw new CError(503, 'Could not connect to the database.')
    }

    return this._dbClient
  }
}

export {
  MongoDB,
}
