import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../tools/generic_api_method_handler'
import { DB } from '../tools/db'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    response.status(500).json({ err: 'Could not connect to the database.' })
    return
  }

  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    response.status(500).json({ err: 'Could not complete ping() operation on the database.' })
    return
  }

  response.status(200).json({ db: 'up' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
