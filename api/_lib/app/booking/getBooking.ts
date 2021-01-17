// data layer imports
import { BookingRepo } from '../../data/booking/BookingRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { IProfile, IBooking } from '../../common/types'

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
