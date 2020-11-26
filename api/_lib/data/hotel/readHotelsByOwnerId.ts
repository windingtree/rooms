import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { buildProjection } from './_projection'
import { hotelCollectionMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IHotelDbRecord, IHotelDbRecordCollection, IHotelCollection } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function readHotelsByOwnerId(ownerId: string): Promise<IHotelCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IHotelDbRecordCollection
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const query = { ownerId: new ObjectID(ownerId) }
    const options = { projection: buildProjection() }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }
    result = []
    await cursor.forEach((item: IHotelDbRecord) => {
      result.push(item)
    })
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`)
  }

  return hotelCollectionMapper(result)
}

export {
  readHotelsByOwnerId,
}
