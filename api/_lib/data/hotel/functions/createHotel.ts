import { HotelRepo } from '../HotelRepo'
import { IBaseHotelDbData, IBaseHotel } from '../../../common/types'

async function createHotel(this: HotelRepo, data: IBaseHotel): Promise<string> {
  const dbData: IBaseHotelDbData = this.mapper.fromBaseEntity(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertOne(dbData)
  } catch (err: unknown) {
    throw this.errorInternalEntityCreate(err)
  }

  if (!result.insertedId) {
    throw this.errorInternalEntityCreate()
  }

  return this.mapper.fromObjectId(result.insertedId)
}

export { createHotel }
