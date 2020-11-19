import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../../_lib/tools'
import { IHotel, IHotelDbRecord } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readHotelByOwnerId(hotelId: string, ownerId: string): Promise<IHotel> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IHotelDbRecord|null
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = { _id: new ObjectID(hotelId), ownerId: new ObjectID(ownerId) }

    const options = {
      projection: {
        _id: 1,
        ownerId: 1,
        name: 1,
        address: 1,
        location: 1,
      },
    }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `A '${ENTITY_NAME}' was not found.`)
  }

  const hotel: IHotel = {
    id: result._id,
    ownerId: result.ownerId,
    name: result.name,
    address: result.address,
    location: result.location,
  }

  return hotel
}

export {
  readHotelByOwnerId,
}
