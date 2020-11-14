import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IHotel } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function readHotelByOwnerId(id: string, ownerId: string): Promise<IHotel> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = { _id: new ObjectID(id), ownerId }

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
    throw new CError(500, `An error occurred while retrieving a '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(404, `A '${ENTITY_NAME}' was not found.`)
  }

  const hotel: IHotel = {
    id: result._id,
    ownerId: result.ownerId,
    name: result.email,
    address: result.oneTimePassword,
    location: result.sessionToken,
  }

  return hotel
}

export {
  readHotelByOwnerId,
}
