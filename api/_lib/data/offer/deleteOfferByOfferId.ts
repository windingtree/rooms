import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../../_lib/tools'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function deleteOfferByOfferId(offerId: string): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const filter = { offerId }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while deleting a '${ENTITY_NAME}'.`)
  }

  if (!result || !result.deletedCount) {
    throw new CError(NOT_FOUND, `Could not delete a '${ENTITY_NAME}'.`)
  }
}

export {
  deleteOfferByOfferId,
}
