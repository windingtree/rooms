import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'

import { genericApiMethodHandler } from '../tools/generic_api_method_handler'
import { DB } from '../tools/db'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  if (!request.body) {
    response.status(500).json({ err: 'request must contain a valid body object' })
    return
  }

  const ownerEmailProp = request.body.email
  if (!ownerEmailProp || typeof ownerEmailProp !== 'string' || ownerEmailProp.length === 0) {
    response.status(500).json({ err: 'owner email not specified' })
    return
  }
  const ownerEmail: string = (ownerEmailProp as string)

  let dbClient
  try {
    dbClient = await DB.getInstance().getDbClient()
  } catch (err) {
    response.status(500).json({ err })
    return
  }
  if (dbClient === null) {
    response.status(500).json({ err: 'No connection to DB' })
    return
  }

  let oneTimePassword: string
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email: ownerEmail }
    const options = {
      sort: { rating: -1 },
      projection: { _id: 0, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (!ownerRecord) {
      oneTimePassword = uuidv4()

      const newOwner = { email: ownerEmail, oneTimePassword }
      const result = await collection.insertOne(newOwner)

      if (!result) {
        throw 'An error occurred while creating a new owner.'
      }
    } else {
      oneTimePassword = ownerRecord.oneTimePassword
    }
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json({ email: ownerEmail, oneTimePassword })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
