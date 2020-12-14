import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { buildProjection } from './_projection'
import { bookingMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IBookingDbRecord, IBooking } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readBookingByHotelId(bookingId: string, hotelId: string): Promise<IBooking> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IBookingDbRecord|null
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const query = { _id: new ObjectID(bookingId), hotelId: new ObjectID(hotelId) }
    const options = { projection: buildProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `Could not retrieve a '${ENTITY_NAME}'.`)
  }

  return bookingMapper(result)
}

export {
  readBookingByHotelId,
}
