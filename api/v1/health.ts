import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { MONGODB_URL } from '../tools/constants'
import { getDbClient } from '../tools/db'

async function run(dbClient: MongoClient) {
  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new Error(err)
  }
}

export default async (request: NowRequest, response: NowResponse) => {
  const dbClient = await getDbClient()
  if (dbClient === null) {
    response.status(500).json({ db: 'down', err: 'No connection to DB' })
    return
  }

  run(dbClient)
    .then(() => {
      response.status(200).json({ db: 'up' })
    })
    .catch((err) => {
      response.status(500).json({ db: 'down', err })
    })
}
