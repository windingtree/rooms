import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { buildProjection } from './_projection'
import { offerMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IOfferDbRecord, IOffer } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readOfferByOfferId(offerId: string): Promise<IOffer> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IOfferDbRecord|null
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const query = { offerId }
    const options = { projection: buildProjection() }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `Could not retrieve a '${ENTITY_NAME}'.`)
  }

  return offerMapper(result)
}

export {
  readOfferByOfferId,
}
