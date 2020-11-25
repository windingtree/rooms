import { IBookingDbRecord, IBooking, IBookingDbRecordCollection, IBookingCollection } from '../../../_lib/types'

function bookingMapper(bookingDbRecord: IBookingDbRecord): IBooking {
  const booking: IBooking = {
    id: bookingDbRecord._id,
    hotelId: bookingDbRecord.hotelId,
    checkInDate: bookingDbRecord.checkInDate,
    checkOutDate: bookingDbRecord.checkOutDate,
    guestName: bookingDbRecord.guestName,
    guestEmail: bookingDbRecord.guestEmail,
    phoneNumber: bookingDbRecord.phoneNumber,
    roomTypeId: bookingDbRecord.roomTypeId,
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
  bookingMapper,
  bookingCollectionMapper,
}
