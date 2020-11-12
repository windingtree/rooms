import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IHotel } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function readHotel(id: string): Promise<IHotel> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = { _id: new ObjectID(id) }

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
  readHotel,
}
