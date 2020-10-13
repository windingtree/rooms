import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, DB } from '../tools'
import { checkLogin } from '../validators'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    checkLogin(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    response.status(500).json({ err: 'Could not connect to the database.' })
    return
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      projection: { _id: 0, email: 1, oneTimePassword: 1, sessionToken: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (
      (!ownerRecord) ||
      (oneTimePassword !== ownerRecord.oneTimePassword) ||
      (sessionToken !== ownerRecord.sessionToken)
    ) {
      throw 'Email or oneTimePassword is wrong.'
    }
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json({ login: 'OK', email, oneTimePassword })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
