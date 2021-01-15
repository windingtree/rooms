import { BookingRepo } from '../../../_lib/data/booking/BookingRepo'
import {
  IProfile,
  IBooking,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const bookingRepo = new BookingRepo()

async function getBooking(requester: IProfile, bookingId: string): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  let booking: IBooking

  if (requester.role === SUPER_ADMIN) {
    booking = await bookingRepo.readBooking(bookingId)
  } else {
    booking = await bookingRepo.readBookingByHotelId(bookingId, requester.hotelId)
  }

  return booking
}

export {
  getBooking,
}
