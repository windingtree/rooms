import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function deleteProfileByEmail(email: string): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const filter = { email }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(500, `An error occurred while deleting a '${ENTITY_NAME}'.`)
  }

  if (!result || !result.deletedCount) {
    throw new CError(404, `A '${ENTITY_NAME}' was not found.`)
  }
}

export {
  deleteProfileByEmail,
}
