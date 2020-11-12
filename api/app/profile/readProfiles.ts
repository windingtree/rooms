import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IProfileCollection } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function readProfiles(): Promise<IProfileCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let result: IProfileDataCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = {}

    const options = {
      projection: {
        _id: 1,
        email: 1,
        oneTimePassword: 1,
        sessionToken: 1,
        role: 1,
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
        email: item.email,
        oneTimePassword: item.oneTimePassword,
        sessionToken: item.sessionToken,
        role: item.role,
      })
    })
  } catch (err) {
    throw new CError(500, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`)
  }

  return result
}

export {
  readProfiles,
}
