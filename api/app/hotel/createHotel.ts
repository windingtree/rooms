import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IHotel, IBaseHotel } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function createHotel(data: IBaseProfile): Promise<IHotel> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    result = await collection.insertOne(data)
  } catch (err) {
    throw new CError(500, `An error occurred while creating a new '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(500, `Could not create a new '${ENTITY_NAME}'.`)
  }

  return Object.assign({}, { id: result.insertedId }, data)
}

export {
  createHotel,
}
