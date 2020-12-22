import { HotelRepo } from '../HotelRepo'
import { CError } from '../../../../_lib/tools'
import { IBaseHotelDbData, IBaseHotel } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function createHotel(this: HotelRepo, data: IBaseHotel): Promise<string> {
  const dbData: IBaseHotelDbData = this.mapper.fromBaseEntity(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertOne(dbData)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while creating a new '${this.ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not create a new '${this.ENTITY_NAME}'.`)
  }

  return this.mapper.fromObjectId(result.insertedId)
}

export {
  createHotel,
}
