import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IProfile } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function deleteProfile(id: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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
  deleteProfile,
}
