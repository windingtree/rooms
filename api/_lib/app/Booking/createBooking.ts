import { createBooking as createBookingRecord } from '../../../_lib/data/booking'
import { IProfile, IBaseBooking, IBooking, IPostBookingPayload } from '../../../_lib/types'

async function createBooking(requester: IProfile, payload: IPostBookingPayload): Promise<IBooking> {
  // TODO: Need to verify things in `payload`, and also implement logic based on roles.

  const data: IBaseBooking = {
    hotelId: payload.hotelId,
    checkInDate: (typeof payload.checkInDate !== 'undefined') ? payload.checkInDate : '',
    checkOutDate: (typeof payload.checkOutDate !== 'undefined') ? payload.checkOutDate : '',
    guestName: (typeof payload.guestName !== 'undefined') ? payload.guestName : '',
    guestEmail: (typeof payload.guestEmail !== 'undefined') ? payload.guestEmail : '',
    phoneNumber: (typeof payload.phoneNumber !== 'undefined') ? payload.phoneNumber : '',
    roomTypeId: (typeof payload.roomTypeId !== 'undefined') ? payload.roomTypeId : '',
  }
  const bookingId: string = await createBookingRecord(data)
  const booking: IBooking = Object.assign({}, data, { id: bookingId })

  return booking
}

export {
  createBooking,
}
