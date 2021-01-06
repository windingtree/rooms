import { HotelRepo } from '../HotelRepo'
import { IPatchHotelPayloadDbData, IPatchHotelPayload } from '../../../../_lib/types'

async function updateHotelByOwnerId(this: HotelRepo, hotelId: string, ownerId: string, data: IPatchHotelPayload): Promise<void> {
  const dbData: IPatchHotelPayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(hotelId), ownerId: this.mapper.toObjectId(ownerId) }
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
  updateHotelByOwnerId,
}
