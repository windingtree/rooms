import { BookingRepo } from '../BookingRepo'

async function deleteBookingByHotelId(this: BookingRepo, bookingId: string, hotelId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(bookingId), hotelId: this.mapper.toObjectId(hotelId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export { deleteBookingByHotelId }
