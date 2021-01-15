import { BookingRepo } from '../../../_lib/data/booking/BookingRepo'
import {
  IProfile,
  IBookingCollection,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const bookingRepo = new BookingRepo()

async function getAllBookings(requester: IProfile): Promise<IBookingCollection> {
  // TODO: Need to implement logic based on roles.

  let bookingCollection: IBookingCollection

  if (requester.role === SUPER_ADMIN) {
    bookingCollection = await bookingRepo.readBookings()
  } else {
    bookingCollection = await bookingRepo.readBookingsByHotelId(requester.hotelId)
  }

  return bookingCollection
}

export {
  getAllBookings,
}
