import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../../_lib/tools'
import { IProfileCollection } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

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
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`)
  }

  return result
}

export {
  readProfiles,
}
