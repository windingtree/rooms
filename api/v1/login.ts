import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, DB, CError, errorHandler } from '../tools'
import { checkLogin } from '../validators'
import { ROOMS_DB_NAME } from '../constants'

async function loginUser(email: string, oneTimePassword: string, sessionToken: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let ownerRecord
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      projection: { _id: 0, email: 1, oneTimePassword: 1, sessionToken: 1 },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Could not login.')
  }

  if (
    (!ownerRecord) ||
    (oneTimePassword !== ownerRecord.oneTimePassword) ||
    (sessionToken !== ownerRecord.sessionToken)
  ) {
    throw new CError(500, 'Email or oneTimePassword is wrong.')
  }
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    checkLogin(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  try {
    await loginUser(email, oneTimePassword, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ login: 'OK', email, oneTimePassword })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
