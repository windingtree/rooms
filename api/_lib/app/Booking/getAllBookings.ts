import { bookingCollectionMapper, readBookings } from '../../../_lib/data/booking'
import { IProfile, IBookingCollection, IBookingDbRecordCollection } from '../../../_lib/types'

async function getAllBookings(requester: IProfile): Promise<IBookingCollection> {
  // TODO: Need to implement logic based on roles.

  const bookingDbRecordCollection: IBookingDbRecordCollection = await readBookings()

  return bookingCollectionMapper(bookingDbRecordCollection)
}

export {
  getAllBookings,
}
