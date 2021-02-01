import { RoomTypeRepo } from '../RoomTypeRepo'
import { IPatchRoomTypePayloadDbData, IPatchRoomTypePayload } from '../../../common/types'

async function updateRoomTypeByHotelId(this: RoomTypeRepo, roomTypeId: string, hotelId: string, data: IPatchRoomTypePayload): Promise<void> {
  const dbData: IPatchRoomTypePayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(roomTypeId), hotelId: this.mapper.toObjectId(hotelId) }
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

export { updateRoomTypeByHotelId }
