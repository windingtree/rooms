import { BookingRepo } from '../BookingRepo'

async function deleteBooking(this: BookingRepo, bookingId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(bookingId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export {
  deleteBooking,
}
