import {
  deleteBooking as deleteBookingDbFunc,
} from '../../../_lib/data/booking'
import { IProfile } from '../../../_lib/types'

async function deleteBooking(requester: IProfile, bookingId: string): Promise<void> {
  // TODO: Need to implement logic based on roles.

  await deleteBookingDbFunc(bookingId)
}

export {
  deleteBooking,
}
