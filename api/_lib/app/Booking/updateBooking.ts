import {
  bookingMapper,
  updateBooking as updateBookingDbFunc,
  readBooking,
} from '../../../_lib/data/booking'
import { IProfile, IBooking, IPatchBookingPayload } from '../../../_lib/types'

async function updateBooking(requester: IProfile, bookingId: string, data: IPatchBookingPayload): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  await updateBookingDbFunc(bookingId, data)
  const bookingDbRecord = await readBooking(bookingId)

  return bookingMapper(bookingDbRecord)
}

export {
  updateBooking,
}
