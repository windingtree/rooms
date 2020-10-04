import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import { methodNotImplemented } from '../tools/generic_response'
import { MONGODB_URL } from '../tools/constants'
import { DB } from '../tools/db'

async function dbLogic(dbClient: MongoClient, ownerEmail: string): Promise<string> {
  let oneTimePassword: string = ''

  try {
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

    if (!ownerRecord) {
      oneTimePassword = uuidv4()

      const newOwner = { email: ownerEmail, oneTimePassword }
      const result = await collection.insertOne(newOwner)
    } else {
      oneTimePassword = ownerRecord.oneTimePassword
    }
  } catch (err) {
    throw new Error(err)
  }

  return oneTimePassword
}

async function methodPost(request: NowRequest, response: NowResponse) {
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

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    response.status(500).json({ err: 'No connection to DB' })
    return
  }

  dbLogic(dbClient, ownerEmail)
    .then((oneTimePassword: string) => {
      response.status(200).json({ email: ownerEmail, oneTimePassword })
    })
    .catch((err: Error) => {
      response.status(500).json({ err })
    })
}

export default async (request: NowRequest, response: NowResponse) => {
  if (!request || typeof request.method !== 'string') {
    throw new Error('must provide request method')
  }

  const method = request.method.toUpperCase()

  switch (method) {
    case 'POST':
      await methodPost(request, response)
      break
    default:
      methodNotImplemented(request, response)
      break
  }
}
