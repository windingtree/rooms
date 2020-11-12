import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IUpdateHotelData } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function updateHotelByOwnerId(id: string, ownerId: string, data: IUpdateHotelData): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const filter = { _id: new ObjectID(id), ownerId }
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
}

export {
  updateHotelByOwnerId,
}
