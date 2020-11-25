import { bookingMapper, readBooking } from '../../../_lib/data/booking'
import { IProfile, IBooking, IBookingDbRecord } from '../../../_lib/types'

async function getBooking(requester: IProfile, bookingId: string): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  const bookingDbRecord: IBookingDbRecord = await readBooking(bookingId)

  return bookingMapper(bookingDbRecord)
}

export {
  getBooking,
}
