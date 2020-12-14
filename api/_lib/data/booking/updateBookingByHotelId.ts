import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { patchBookingPayloadDbDataMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IPatchBookingPayloadDbData, IPatchBookingPayload } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function updateBookingByHotelId(bookingId: string, hotelId: string, data: IPatchBookingPayload): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const dbData: IPatchBookingPayloadDbData = patchBookingPayloadDbDataMapper(data)

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const filter = { _id: new ObjectID(bookingId), hotelId: new ObjectID(hotelId) }
    const options = { upsert: false }
    const updateDoc = { $set: dbData }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while updating a '${ENTITY_NAME}'.`, err)
  }

  if (!result || !result.matchedCount) {
    throw new CError(NOT_FOUND, `Could not update a '${ENTITY_NAME}'.`)
  }
}

export {
  updateBookingByHotelId,
}
