import { HotelRepo } from '../HotelRepo'

async function deleteHotelByOwnerId(this: HotelRepo, hotelId: string, ownerId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(hotelId), ownerId: this.mapper.toObjectId(ownerId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export {
  deleteHotelByOwnerId,
}
