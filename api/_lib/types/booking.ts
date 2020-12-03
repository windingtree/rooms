import { ObjectID } from 'mongodb'

interface IBaseBooking {
  orderId: string
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

interface IBaseBookingDbRecord {
  orderId: string
  hotelId: ObjectID|null
  checkInDate: string
  checkOutDate: string
  guestName: string
  guestEmail: string
  phoneNumber: string
  roomTypeId: ObjectID|null
}

interface IBookingDbRecord extends IBaseBookingDbRecord {
  _id: ObjectID|null
}

interface IPatchBookingPayloadDbData {
  hotelId?: ObjectID|null
  checkInDate?: string
  checkOutDate?: string
  guestName?: string
  guestEmail?: string
  phoneNumber?: string
  roomTypeId?: ObjectID|null
}

type IBookingDbRecordCollection = Array<IBookingDbRecord>

export {
  IBaseBooking,
  IBooking,
  IBookingCollection,
  IPostBookingPayload,
  IPatchBookingPayload,
  IBaseBookingDbRecord,
  IBookingDbRecord,
  IPatchBookingPayloadDbData,
  IBookingDbRecordCollection,
}
