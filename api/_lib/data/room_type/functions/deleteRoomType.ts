import { RoomTypeRepo } from '../RoomTypeRepo'

async function deleteRoomType(this: RoomTypeRepo, roomTypeId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(roomTypeId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export { deleteRoomType }
