import { MongoClient } from 'mongodb'

const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/test'

async function authorizeUser(email: string, oneTimePassword: string): Promise<boolean> {
  let userIsAuthorized: boolean = false

  const dbClient = new MongoClient(mongodb_url, {
    useUnifiedTopology: true
  })

  try {
    await dbClient.connect()

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      // sort matched documents in descending order by rating
      sort: { rating: -1 },
      // Include only the `email` and `imdb` fields in the returned document
      projection: { _id: 0, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (ownerRecord && ownerRecord.oneTimePassword === oneTimePassword) {
      userIsAuthorized = true
    }
  } finally {
    await dbClient.close()
  }

  return userIsAuthorized
}

export {
  authorizeUser
}
