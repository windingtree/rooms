// data layer imports
import { BookingRepo } from '../../data/booking/BookingRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { IProfile, IBooking, IPatchBookingPayload } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const bookingRepo = new BookingRepo()

async function updateBooking(requester: IProfile, bookingId: string, data: IPatchBookingPayload): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  let booking: IBooking

  if (requester.role === SUPER_ADMIN) {
    await bookingRepo.updateBooking(bookingId, data)
    booking = await bookingRepo.readBooking(bookingId)
  } else {
    await bookingRepo.updateBookingByHotelId(bookingId, requester.hotelId, data)
    booking = await bookingRepo.readBookingByHotelId(bookingId, requester.hotelId)
  }

  return booking
}

export {
  updateBooking,
}
