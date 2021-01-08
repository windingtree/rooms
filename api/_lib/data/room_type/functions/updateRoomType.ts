import { RoomTypeRepo } from '../RoomTypeRepo'
import { IPatchRoomTypePayloadDbData, IPatchRoomTypePayload } from '../../../../_lib/types'

async function updateRoomType(this: RoomTypeRepo, roomTypeId: string, data: IPatchRoomTypePayload): Promise<void> {
  const dbData: IPatchRoomTypePayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(roomTypeId) }
    const options = { upsert: false }
    const updateDoc = { $set: dbData }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityUpdate(err)
  }

  if (!result || !result.matchedCount) {
    throw this.errorEntityNotFound()
  }
}

export {
  updateRoomType,
}
