import {
  updateBooking as updateBookingDbFunc,
  updateBookingByHotelId as updateBookingByHotelIdDbFunc,
  readBooking as readBookingDbFunc,
  readBookingByHotelId as readBookingByHotelIdDbFunc,
} from '../../../_lib/data/booking'
import {
  IProfile,
  IBooking,
  IPatchBookingPayload,
} from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function updateBooking(requester: IProfile, bookingId: string, data: IPatchBookingPayload): Promise<IBooking> {
  // TODO: Need to implement logic based on roles.

  let booking: IBooking

  if (requester.role === SUPER_ADMIN) {
    await updateBookingDbFunc(bookingId, data)
    booking = await readBookingDbFunc(bookingId)
  } else {
    await updateBookingByHotelIdDbFunc(bookingId, requester.hotelId, data)
    booking = await readBookingByHotelIdDbFunc(bookingId, requester.hotelId)
  }

  return booking
}

export {
  updateBooking,
}
