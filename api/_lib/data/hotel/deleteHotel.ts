import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function deleteHotel(id: string): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const filter = { _id: new ObjectID(id) }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(500, `An error occurred while deleting a '${ENTITY_NAME}'.`)
  }

  if (!result || !result.deletedCount) {
    throw new CError(404, `A '${ENTITY_NAME}' was not found.`)
  }
}

export {
  deleteHotel,
}
