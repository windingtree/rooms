import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IProfileCollection } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function readProfiles(): Promise<IProfileCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IProfileCollection
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = {}

    const options = {
      projection: {
        _id: 1,
        email: 1,
        name: 1,
        phone: 1,
        oneTimePassword: 1,
        sessionToken: 1,
        role: 1,
        hotelId: 1,
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
        name: item.name,
        phone: item.phone,
        oneTimePassword: item.oneTimePassword,
        sessionToken: item.sessionToken,
        role: item.role,
        hotelId: item.hotelId,
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
