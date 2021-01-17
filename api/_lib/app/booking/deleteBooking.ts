// data layer imports
import { BookingRepo } from '../../data/booking/BookingRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { IProfile, IStatus } from '../../common/types'

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
