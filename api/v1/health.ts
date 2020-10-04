import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { methodNotImplemented } from '../tools/generic_response'
import { MONGODB_URL } from '../tools/constants'
import { DB } from '../tools/db'

async function run(dbClient: MongoClient) {
  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new Error(err)
  }
}

async function methodGet(request: NowRequest, response: NowResponse) {
  const dbClient = await DB.getInstance().getDbClient()
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

export default async (request: NowRequest, response: NowResponse) => {
  if (!request || typeof request.method !== 'string') {
    throw new Error('must provide request method')
  }

  const method = request.method.toUpperCase()

  switch (method) {
    case 'GET':
      await methodGet(request, response)
      break
    default:
      methodNotImplemented(request, response)
      break
  }
}
