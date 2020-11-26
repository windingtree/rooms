import {
  readBooking as readBookingDbFunc,
  readBookingByHotelId as readBookingByHotelIdDbFunc,
} from '../../../_lib/data/booking'
import {
  IProfile,
  IBooking,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function getBooking(requester: IProfile, bookingId: string): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  let booking: IBooking

  if (requester.role === SUPER_ADMIN) {
    booking = await readBookingDbFunc(bookingId)
  } else {
    booking = await readBookingByHotelIdDbFunc(bookingId, requester.hotelId)
  }

  return booking
}

export {
  getBooking,
}
