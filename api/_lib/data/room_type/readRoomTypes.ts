import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../../_lib/tools'
import { IRoomTypeDbRecord, IRoomTypeDbRecordCollection } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function readRoomTypes(): Promise<IRoomTypeDbRecordCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result: IRoomTypeDbRecordCollection
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
    await cursor.forEach((item: IRoomTypeDbRecord) => {
      result.push(item)
    })
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`)
  }

  return result
}

export {
  readRoomTypes,
}