import { RoomTypeRepo } from '../RoomTypeRepo'
import { IBaseRoomTypeDbData, IBaseRoomType } from '../../../common/types'

async function createRoomType(this: RoomTypeRepo, data: IBaseRoomType): Promise<string> {
  const dbData: IBaseRoomTypeDbData = this.mapper.fromBaseEntity(data)

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

export {
  createRoomType,
}
