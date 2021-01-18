import { RoomTypeRepo } from '../RoomTypeRepo'
import { IRoomTypeCollectionDbData, IRoomTypeCollection } from '../../../common/types'

async function readRoomTypesByHotelId(this: RoomTypeRepo, hotelId: string): Promise<IRoomTypeCollection> {
  const result: IRoomTypeCollectionDbData = []
  try {
    const collection = await this.getCollection()
    const query = { hotelId: this.mapper.toObjectId(hotelId) }
    const options = { projection: this.getProjection() }

    const cursor = collection.find(query, options)
    if ((await cursor.count()) === 0) {
      return []
    }
    await cursor.forEach((item) => {
      result.push(item)
    })
  } catch (err: unknown) {
    throw this.errorInternalEntityCollectionRead(err)
  }

  return this.mapper.toEntityCollection(result)
}

export { readRoomTypesByHotelId }
