import { bookingMapper, createBooking as createBookingRecord, readBooking as readBookingDbFunc } from '../../../_lib/data/booking'
import { IProfile, IBaseBooking, IBooking, IBookingDbRecord, IPostBookingPayload } from '../../../_lib/types'

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

  const bookingDbRecord: IBookingDbRecord = await readBookingDbFunc(bookingId)
  const booking: IBooking = bookingMapper(bookingDbRecord)

  return booking
}

export {
  createBooking,
}
