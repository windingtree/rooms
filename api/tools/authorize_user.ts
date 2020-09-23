import { MongoClient } from 'mongodb'

import { getDbClient } from './db'
import { MONGODB_URL } from './constants'

async function authorizeUser(email: string, oneTimePassword: string): Promise<boolean> {
  let userIsAuthorized: boolean = false

  try {
    const dbClient = await getDbClient()
    if (dbClient === null) {
      throw new Error('No connection to DB')
    }

    const database = (dbClient as MongoClient).db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      sort: { rating: -1 },
      projection: { _id: 0, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (ownerRecord && ownerRecord.oneTimePassword === oneTimePassword) {
      userIsAuthorized = true
    }
  } catch (err) {
    userIsAuthorized = false
  }

  return userIsAuthorized
}

export {
  authorizeUser
}
