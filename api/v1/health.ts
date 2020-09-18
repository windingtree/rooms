import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/test'

async function run(client: MongoClient) {
  try {
    await client.connect()
    await client.db().admin().ping()
  } finally {
    await client.close()
  }
}

export default (request: NowRequest, response: NowResponse) => {
  const client = new MongoClient(mongodb_url)

  run(client)
    .then(() => {
      response.status(200).send({ db: 'up' })
    })
    .catch((err) => {
      response.status(500).send({ db: 'down', err })
    })
}
