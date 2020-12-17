import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { projection } from './_projection'
import { mapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IHotelDbData, IHotel } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readHotelByOwnerId(hotelId: string, ownerId: string): Promise<IHotel> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IHotelDbData|null
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const query = { _id: new ObjectID(hotelId), ownerId: new ObjectID(ownerId) }
    const options = { projection }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `Could not retrieve a '${ENTITY_NAME}'.`)
  }

  return mapper.toEntity(result)
}

export {
  readHotelByOwnerId,
}
