interface IBaseBooking {
  hotelId: string
  checkInDate: string
  checkOutDate: string
  guestName: string
  guestEmail: string
  phoneNumber: string
  roomTypeId: string
}

interface IBooking extends IBaseBooking {
  id: string
}

type IBookingCollection = Array<IBooking>

interface IPostBookingPayload {
  hotelId: string
  checkInDate?: string
  checkOutDate?: string
  guestName?: string
  guestEmail?: string
  phoneNumber?: string
  roomTypeId?: string
}

interface IPatchBookingPayload {
  hotelId?: string
  checkInDate?: string
  checkOutDate?: string
  guestName?: string
  guestEmail?: string
  phoneNumber?: string
  roomTypeId?: string
}

interface IBookingDbRecord extends IBaseBooking {
  _id: string
}

type IBookingDbRecordCollection = Array<IBookingDbRecord>

export {
  IBaseBooking,
  IBooking,
  IBookingCollection,
  IPostBookingPayload,
  IPatchBookingPayload,
  IBookingDbRecord,
  IBookingDbRecordCollection,
}
