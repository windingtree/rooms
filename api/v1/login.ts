import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, DB } from '../tools'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  if (!request.body) {
    response.status(500).json({ err: 'request must contain a valid body object' })
    return
  }

  const emailProp = request.body.email
  if (!emailProp || typeof emailProp !== 'string' || emailProp.length === 0) {
    response.status(500).json({ err: 'Property email not specified.' })
    return
  }
  const email: string = (emailProp as string)

  const oneTimePasswordProp = request.body.oneTimePassword
  if (!oneTimePasswordProp || typeof oneTimePasswordProp !== 'string' || oneTimePasswordProp.length === 0) {
    response.status(500).json({ err: 'Property oneTimePassword not specified' })
    return
  }
  const oneTimePassword: string = (oneTimePasswordProp as string)

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    response.status(500).json({ err: 'Could not connect to the database.' })
    return
  }

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      sort: { rating: -1 },
      projection: { _id: 0, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (!ownerRecord || oneTimePassword !== ownerRecord.oneTimePassword) {
      throw 'Email or oneTimePassword do not match a user.'
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
