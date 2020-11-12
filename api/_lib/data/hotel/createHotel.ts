import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IHotel, IBaseHotel } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function createHotel(data: IBaseHotel): Promise<IHotel> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    result = await collection.insertOne(data)
  } catch (err) {
    throw new CError(500, `An error occurred while creating a new '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(500, `Could not create a new '${ENTITY_NAME}'.`)
  }

  /**
   * When inserting a new document, MongoDB will add a property `_id` to the data payload.
   * We will remove it ourselves, before passing the data back to the application layer.
   *
   * See https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#id-field
   *
   * That's the purpose of the object { _id: undefined } passed to Object.assign() function
   * below.
   */

  return Object.assign({}, { id: result.insertedId }, data, { _id: undefined })
}

export {
  createHotel,
}
