import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { baseRoomTypeDbRecordMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IBaseRoomTypeDbRecord, IBaseRoomType } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function createRoomType(data: IBaseRoomType): Promise<string> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const dbData: IBaseRoomTypeDbRecord = baseRoomTypeDbRecordMapper(data)

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    result = await collection.insertOne(dbData)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while creating a new '${ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not create a new '${ENTITY_NAME}'.`)
  }

  return result.insertedId
}

export {
  createRoomType,
}
