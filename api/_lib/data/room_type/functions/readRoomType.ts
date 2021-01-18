import { RoomTypeRepo } from '../RoomTypeRepo'
import { IRoomTypeDbData, IRoomType } from '../../../common/types'

async function readRoomType(this: RoomTypeRepo, roomTypeId: string): Promise<IRoomType> {
  let result: IRoomTypeDbData|null
  try {
    const collection = await this.getCollection()
    const query = { _id: this.mapper.toObjectId(roomTypeId) }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityRead(err)
  }

  if (!result) {
    throw this.errorEntityNotFound()
  }

  return this.mapper.toEntity(result)
}

export { readRoomType }
