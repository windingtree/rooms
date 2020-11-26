import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { baseHotelDbRecordMapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IBaseHotelDbRecord, IBaseHotel } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function createHotel(data: IBaseHotel): Promise<string> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const dbData: IBaseHotelDbRecord = baseHotelDbRecordMapper(data)

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    result = await collection.insertOne(dbData)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while creating a new '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not create a new '${ENTITY_NAME}'.`)
  }

  return result.insertedId
}

export {
  createHotel,
}
