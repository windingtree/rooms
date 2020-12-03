import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseBookingDbRecord,
  IBookingDbRecord,
  IBookingDbRecordCollection,
  IPatchBookingPayloadDbData,

  IBaseBooking,
  IBooking,
  IBookingCollection,
  IPatchBookingPayload,
} from '../../../_lib/types'

function baseBookingDbRecordMapper(baseBooking: IBaseBooking): IBaseBookingDbRecord {
  const baseBookingDbRecord: IBaseBookingDbRecord = {
    orderId: baseBooking.orderId,
    hotelId: getObjectId(baseBooking.hotelId),
    checkInDate: baseBooking.checkInDate,
    checkOutDate: baseBooking.checkOutDate,
    guestName: baseBooking.guestName,
    guestEmail: baseBooking.guestEmail,
    phoneNumber: baseBooking.phoneNumber,
    roomTypeId: getObjectId(baseBooking.roomTypeId),
  }

  return baseBookingDbRecord
}

function patchBookingPayloadDbDataMapper(patchBookingPayload: IPatchBookingPayload): IPatchBookingPayloadDbData {
  const patchBookingPayloadDbData: IPatchBookingPayloadDbData = {}
  let prop: keyof IPatchBookingPayload

  prop = 'hotelId'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = getObjectId(patchBookingPayload[prop])
  }

  prop = 'checkInDate'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
  }

  prop = 'checkOutDate'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
  }

  prop = 'guestName'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
  }

  prop = 'guestEmail'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
  }

  prop = 'phoneNumber'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
  }

  prop = 'roomTypeId'
  if (typeof patchBookingPayload[prop] !== 'undefined') {
    patchBookingPayloadDbData[prop] = getObjectId(patchBookingPayload[prop])
  }

  return patchBookingPayloadDbData
}

function bookingMapper(bookingDbRecord: IBookingDbRecord): IBooking {
  const booking: IBooking = {
    id: getObjectIdString(bookingDbRecord._id),
    orderId: bookingDbRecord.orderId,
    hotelId: getObjectIdString(bookingDbRecord.hotelId),
    checkInDate: bookingDbRecord.checkInDate,
    checkOutDate: bookingDbRecord.checkOutDate,
    guestName: bookingDbRecord.guestName,
    guestEmail: bookingDbRecord.guestEmail,
    phoneNumber: bookingDbRecord.phoneNumber,
    roomTypeId: getObjectIdString(bookingDbRecord.roomTypeId),
  }

  return booking
}

function bookingCollectionMapper(bookingDbRecordCollection: IBookingDbRecordCollection): IBookingCollection {
  const bookings: IBookingCollection = []
  bookingDbRecordCollection.forEach((bookingDbRecord) => {
    bookings.push(bookingMapper(bookingDbRecord))
  })

  return bookings
}

export {
  baseBookingDbRecordMapper,
  patchBookingPayloadDbDataMapper,
  bookingMapper,
  bookingCollectionMapper,
}
