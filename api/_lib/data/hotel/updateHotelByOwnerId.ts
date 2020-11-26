import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { patchHotelPayloadDbDataMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IPatchHotelPayloadDbData, IPatchHotelPayload } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function updateHotelByOwnerId(hotelId: string, ownerId: string, data: IPatchHotelPayload): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const dbData: IPatchHotelPayloadDbData = patchHotelPayloadDbDataMapper(data)

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const filter = { _id: new ObjectID(hotelId), ownerId: new ObjectID(ownerId) }
    const options = { upsert: false }
    const updateDoc = { $set: dbData }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while updating a '${ENTITY_NAME}'.`)
  }

  if (!result || !result.matchedCount) {
    throw new CError(NOT_FOUND, `Could not update a '${ENTITY_NAME}'.`)
  }
}

export {
  updateHotelByOwnerId,
}
