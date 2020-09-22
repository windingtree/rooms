import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/test'

async function dbLogic(dbClient: MongoClient, ownerEmail: string): Promise<string> {
  let oneTimePassword: string = ''

  try {
    await dbClient.connect()

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email: ownerEmail }

    const options = {
      // sort matched documents in descending order by rating
      sort: { rating: -1 },
      // Include only the `email` and `imdb` fields in the returned document
      projection: { _id: 0, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    // since this method returns the matched document, not a cursor, print it directly
    console.log(ownerRecord)

    if (!ownerRecord) {
      oneTimePassword = uuidv4()

      const newOwner = { email: ownerEmail, oneTimePassword };
      const result = await collection.insertOne(newOwner);
    } else {
      oneTimePassword = ownerRecord.oneTimePassword
    }
  } finally {
    await dbClient.close()
  }

  return oneTimePassword
}

export default (request: NowRequest, response: NowResponse) => {
  if (!request.body) {
    response.status(500).json({ err: 'request must contain a valid body object' })
    return
  }

  const ownerEmailProp: any = request.body.email
  if (!ownerEmailProp || typeof ownerEmailProp !== 'string' || ownerEmailProp.length === 0) {
    response.status(500).json({ err: 'owner email not specified' })
    return
  }
  const ownerEmail: string = (ownerEmailProp as string)

  const dbClient = new MongoClient(mongodb_url, {
    useUnifiedTopology: true
  })

  dbLogic(dbClient, ownerEmail)
    .then((oneTimePassword: string) => {
      response.status(200).json({ email: ownerEmail, oneTimePassword })
    })
    .catch((err: Error) => {
      response.status(500).json({ err })
    })
}
