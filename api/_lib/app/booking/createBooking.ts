import { v4 as uuidv4 } from 'uuid'

import { BookingRepo } from '../../data/booking/BookingRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IBaseBooking, IBooking, IPostBookingPayload } from '../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const bookingRepo = new BookingRepo()

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

  const baseBooking: IBaseBooking = {
    orderId: uuidv4(),
    hotelId: payload.hotelId,
    checkInDate: (typeof payload.checkInDate !== 'undefined') ? payload.checkInDate : '',
    checkOutDate: (typeof payload.checkOutDate !== 'undefined') ? payload.checkOutDate : '',
    guestName: (typeof payload.guestName !== 'undefined') ? payload.guestName : '',
    guestEmail: (typeof payload.guestEmail !== 'undefined') ? payload.guestEmail : '',
    phoneNumber: (typeof payload.phoneNumber !== 'undefined') ? payload.phoneNumber : '',
    roomTypeId: (typeof payload.roomTypeId !== 'undefined') ? payload.roomTypeId : '',
  }
  const bookingId: string = await bookingRepo.createBooking(baseBooking)
  const booking: IBooking = Object.assign({}, baseBooking, { id: bookingId })

  return booking
}

export { createBooking }
