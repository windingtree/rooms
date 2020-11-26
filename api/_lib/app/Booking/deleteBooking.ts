import {
  deleteBooking as deleteBookingDbFunc,
  deleteBookingByHotelId as deleteBookingByHotelIdDbFunc,
} from '../../../_lib/data/booking'
import { IProfile } from '../../../_lib/types'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function deleteBooking(requester: IProfile, bookingId: string): Promise<void> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === SUPER_ADMIN) {
    await deleteBookingDbFunc(bookingId)
  } else {
    await deleteBookingByHotelIdDbFunc(bookingId, requester.hotelId)
  }

}

export {
  deleteBooking,
}
