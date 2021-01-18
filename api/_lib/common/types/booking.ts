import { ObjectID } from 'mongodb'

type TBookingDbDataFields =
  | '_id'
  | 'orderId'
  | 'hotelId'
  | 'checkInDate'
  | 'checkOutDate'
  | 'guestName'
  | 'guestEmail'
  | 'phoneNumber'
  | 'roomTypeId'

type IBookingDbDataProjection = {
  [key in TBookingDbDataFields]?: 1
}

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

interface IBaseBookingDbData {
  orderId: string
  hotelId: ObjectID|null
  checkInDate: Date|null
  checkOutDate: Date|null
  guestName: string
  guestEmail: string
  phoneNumber: string
  roomTypeId: ObjectID|null
}

interface IBookingDbData extends IBaseBookingDbData {
  _id: ObjectID|null
}

interface IPatchBookingPayloadDbData {
  hotelId?: ObjectID|null
  checkInDate?: Date|null
  checkOutDate?: Date|null
  guestName?: string
  guestEmail?: string
  phoneNumber?: string
  roomTypeId?: ObjectID|null
}

type IBookingCollectionDbData = Array<IBookingDbData>

export {
  TBookingDbDataFields,
  IBookingDbDataProjection,
  IBaseBooking,
  IBooking,
  IBookingCollection,
  IPostBookingPayload,
  IPatchBookingPayload,
  IBaseBookingDbData,
  IBookingDbData,
  IPatchBookingPayloadDbData,
  IBookingCollectionDbData,
}
