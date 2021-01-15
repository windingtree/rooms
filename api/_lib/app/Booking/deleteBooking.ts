import { BookingRepo } from '../../../_lib/data/booking/BookingRepo'
import { IProfile, IStatus } from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const bookingRepo = new BookingRepo()

async function deleteBooking(requester: IProfile, bookingId: string): Promise<IStatus> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === SUPER_ADMIN) {
    await bookingRepo.deleteBooking(bookingId)
  } else {
    await bookingRepo.deleteBookingByHotelId(bookingId, requester.hotelId)
  }

  return { status: 'OK' }
}

export {
  deleteBooking,
}
