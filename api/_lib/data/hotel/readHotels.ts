import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IHotelCollection, IHotelDbRecord } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function readHotels(): Promise<IHotelCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IHotelCollection
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = {}

    const options = {
      projection: {
        _id: 1,
        ownerId: 1,
        name: 1,
        address: 1,
        location: 1,
      },
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }

    result = []
    await cursor.forEach((item: IHotelDbRecord) => {
      result.push({
        id: item._id,
        ownerId: item.ownerId,
        name: item.name,
        address: item.address,
        location: item.location,
      })
    })
  } catch (err) {
    throw new CError(500, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`)
  }

  return result
}

export {
  readHotels,
}