import { MongoClient } from 'mongodb'

import { MONGODB_URL } from './constants'

class DB {
  private static _instance: DB = new DB();

  private _dbClient: MongoClient | null = null

  constructor() {
    if (DB._instance) {
      throw new Error("Error: Instantiation failed: Use DB.getInstance() instead of new.");
    }
    DB._instance = this;
  }

  public static getInstance(): DB {
    return DB._instance;
  }

  private async createDbConnection() {
    if (this._dbClient) {
      return
    }

    this._dbClient = new MongoClient(MONGODB_URL, { useUnifiedTopology: true });

    /* -------------------------------------------------- */
    console.log('calling _dbClient.connect() ...')
    console.time('db_connect')

    await this._dbClient.connect()

    console.timeEnd('db_connect')
    /* -------------------------------------------------- */
  }

  public async getDbClient(): Promise<MongoClient|null> {
    await DB._instance.createDbConnection()
    return this._dbClient
  }
}

export {
  DB
}
