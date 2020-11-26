import {
  createBooking as createBookingDbFunc,
  readBooking as readBookingDbFunc,
} from '../../../_lib/data/booking'
import {
  CError,
} from '../../../_lib/tools'
import {
  CONSTANTS,
} from '../../../_lib/infra/constants'
import {
  IProfile,
  IBaseBooking,
  IBooking,
  IPostBookingPayload,
} from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function createBooking(requester: IProfile, payload: IPostBookingPayload): Promise<IBooking> {
  // TODO: Need to verify things in `payload`, and also implement logic based on roles.

  if (
    (requester.role !== SUPER_ADMIN) &&
    (requester.hotelId !== payload.hotelId)
  ) {
    throw new CError(
      BAD_REQUEST,
      `User with role ${requester.role} is not allowed to create a Booking for a hotel which is not his.`
    )
  }

  const data: IBaseBooking = {
    hotelId: payload.hotelId,
    checkInDate: (typeof payload.checkInDate !== 'undefined') ? payload.checkInDate : '',
    checkOutDate: (typeof payload.checkOutDate !== 'undefined') ? payload.checkOutDate : '',
    guestName: (typeof payload.guestName !== 'undefined') ? payload.guestName : '',
    guestEmail: (typeof payload.guestEmail !== 'undefined') ? payload.guestEmail : '',
    phoneNumber: (typeof payload.phoneNumber !== 'undefined') ? payload.phoneNumber : '',
    roomTypeId: (typeof payload.roomTypeId !== 'undefined') ? payload.roomTypeId : '',
  }
  const bookingId: string = await createBookingDbFunc(data)
  const booking: IBooking = await readBookingDbFunc(bookingId)

  return booking
}

export {
  createBooking,
}
