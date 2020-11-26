import {
  readBookings as readBookingsDbFunc,
  readBookingsByHotelId as readBookingsByHotelIdDbFunc,
} from '../../../_lib/data/booking'
import {
  IProfile,
  IBookingCollection,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getAllBookings(requester: IProfile): Promise<IBookingCollection> {
  // TODO: Need to implement logic based on roles.

  let bookingCollection: IBookingCollection

  if (requester.role === SUPER_ADMIN) {
    bookingCollection = await readBookingsDbFunc()
  } else {
    bookingCollection = await readBookingsByHotelIdDbFunc(requester.hotelId)
  }

  return bookingCollection
}

export {
  getAllBookings,
}
