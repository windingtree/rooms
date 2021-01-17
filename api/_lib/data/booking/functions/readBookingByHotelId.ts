import { BookingRepo } from '../BookingRepo'
import { IBookingDbData, IBooking } from '../../../common/types'

async function readBookingByHotelId(this: BookingRepo, bookingId: string, hotelId: string): Promise<IBooking> {
  let result: IBookingDbData|null
  try {
    const collection = await this.getCollection()
    const query = { _id: this.mapper.toObjectId(bookingId), hotelId: this.mapper.toObjectId(hotelId) }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityRead(err)
  }

  if (!result) {
    throw this.errorEntityNotFound()
  }

  return this.mapper.toEntity(result)
}

export {
  readBookingByHotelId,
}
