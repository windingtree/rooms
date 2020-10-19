import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IBaseBooking {
  checkInDate: string
  checkOutDate: string
  guestName: string
  guestEmail: string
  phoneNumber: string
  roomType: string
}

interface IBooking extends IBaseBooking {
  id: string
}

type IBookingCollection = Array<IBooking>

export {
  IBaseBooking,
  IBooking,
  IBookingCollection,
}
