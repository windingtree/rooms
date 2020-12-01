import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { offerCollectionDbRecordMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IOfferCollection, IOfferCollectionDbRecord } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function createOffers(data: IOfferCollection): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const dbData: IOfferCollectionDbRecord = offerCollectionDbRecordMapper(data)

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    result = await collection.insertMany(dbData)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while creating a new '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not create a new '${ENTITY_NAME}'.`)
  }
}

export {
  createOffers,
}
