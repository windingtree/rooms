import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, DB, CError, errorHandler } from '../tools'

async function pingDb(): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new CError(500, 'Could not complete ping() operation on the database.')
  }
}

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await pingDb()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ db: 'up' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
