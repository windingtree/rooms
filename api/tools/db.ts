import { MongoClient } from 'mongodb'

import { MONGODB_URL } from './constants'

let dbClient: MongoClient|null = null

async function createDbConnection() {
  if (dbClient !== null) {
    return
  }

  try {
    dbClient = new MongoClient(MONGODB_URL, { useUnifiedTopology: true })
    await dbClient.connect()
  } catch (err) {
    dbClient = null
  }
}

async function getDbClient(): Promise<MongoClient|null> {
  await createDbConnection()
  return dbClient
}

export {
  getDbClient
}
