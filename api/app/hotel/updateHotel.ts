import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IHotel, IUpdateHotelData } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function updateHotel(id: string, data: IUpdateHotelData): Promise<IHotel> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }

    const updateDoc = {
      $set: data
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, `An error occurred while updating a '${ENTITY_NAME}'.`)
  }

  if (!result || !result.matchedCount) {
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
  updateHotel,
}
