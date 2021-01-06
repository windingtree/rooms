import { HotelRepo } from '../HotelRepo'

async function deleteHotel(this: HotelRepo, hotelId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(hotelId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export {
  deleteHotel,
}
