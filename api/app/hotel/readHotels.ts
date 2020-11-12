import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IHotelCollection } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function readHotels(): Promise<IHotelCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let result: IHotelDataCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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
    await cursor.forEach((item) => {
      result.push({
        id: item._id,
        ownerId: item.ownerId,
        name: item.email,
        address: item.oneTimePassword,
        location: item.sessionToken,
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
