import { MongoClient } from 'mongodb'

import { MONGODB_URL } from '../constants'

class DB {
  private static _instance: DB = new DB()
  private _dbClient: MongoClient|null = null

  constructor() {
    if (DB._instance) {
      throw 'DB class instantiation failed. Use DB.getInstance() instead of new operator.'
    }
    DB._instance = this
  }

  public static getInstance(): DB {
    return DB._instance
  }

  private async createDbConnection(): Promise<void> {
    if (this._dbClient) {
      return
    }

    try {
      this._dbClient = new MongoClient(MONGODB_URL, { useUnifiedTopology: true })
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

  public async getDbClient(): Promise<MongoClient|null> {
    await DB._instance.createDbConnection()
    return this._dbClient
  }
}

export {
  DB,
}
