import { BookingRepo } from '../BookingRepo'
import { IPatchBookingPayloadDbData, IPatchBookingPayload } from '../../../../_lib/types'

async function updateBookingByHotelId(this: BookingRepo, bookingId: string, hotelId: string, data: IPatchBookingPayload): Promise<void> {
  const dbData: IPatchBookingPayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(bookingId), hotelId: this.mapper.toObjectId(hotelId) }
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
  updateBookingByHotelId,
}
