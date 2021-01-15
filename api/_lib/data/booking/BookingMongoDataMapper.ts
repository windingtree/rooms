import {
  BaseMongoDataMapper,
} from '../../../_lib/tools'
import {
  IBaseBookingDbData,
  IBookingDbData,
  IBookingCollectionDbData,
  IPatchBookingPayloadDbData,

  IBaseBooking,
  IBooking,
  IBookingCollection,
  IPatchBookingPayload,
} from '../../../_lib/types'

class BookingMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseBooking: IBaseBooking): IBaseBookingDbData {
    return {
      orderId: baseBooking.orderId,
      hotelId: this.toObjectId(baseBooking.hotelId),
      checkInDate: this.toDate(baseBooking.checkInDate),
      checkOutDate: this.toDate(baseBooking.checkOutDate),
      guestName: baseBooking.guestName,
      guestEmail: baseBooking.guestEmail,
      phoneNumber: baseBooking.phoneNumber,
      roomTypeId: this.toObjectId(baseBooking.roomTypeId),
    }
  }

  toBaseEntity(baseBookingDbData: IBaseBookingDbData): IBaseBooking {
    return {
      orderId: baseBookingDbData.orderId,
      hotelId: this.fromObjectId(baseBookingDbData.hotelId),
      checkInDate: this.fromDate(baseBookingDbData.checkInDate),
      checkOutDate: this.fromDate(baseBookingDbData.checkOutDate),
      guestName: baseBookingDbData.guestName,
      guestEmail: baseBookingDbData.guestEmail,
      phoneNumber: baseBookingDbData.phoneNumber,
      roomTypeId: this.fromObjectId(baseBookingDbData.roomTypeId),
    }
  }

  fromPatchEntityPayload(patchBookingPayload: IPatchBookingPayload): IPatchBookingPayloadDbData {
    const availProps: Array<keyof IPatchBookingPayload> = [
      'hotelId',
      'checkInDate',
      'checkOutDate',
      'guestName',
      'guestEmail',
      'phoneNumber',
      'roomTypeId',
    ]

    return availProps.reduce((patchBookingPayloadDbData: IPatchBookingPayloadDbData, prop): IPatchBookingPayloadDbData => {
      if (!patchBookingPayload[prop]) {
        return patchBookingPayloadDbData
      }

      switch (prop) {
        case 'guestName':
        case 'guestEmail':
        case 'phoneNumber':
          patchBookingPayloadDbData[prop] = patchBookingPayload[prop]
          break
        case 'checkInDate':
        case 'checkOutDate':
          patchBookingPayloadDbData[prop] = this.toDate((patchBookingPayload[prop] as string))
          break
        case 'hotelId':
        case 'roomTypeId':
          patchBookingPayloadDbData[prop] = this.toObjectId((patchBookingPayload[prop] as string))
          break
      }

      return patchBookingPayloadDbData
    }, {})
  }

  fromEntity(booking: IBooking): IBookingDbData {
    return Object.assign({ _id: this.toObjectId(booking.id) }, this.fromBaseEntity(booking))
  }

  toEntity(bookingDbData: IBookingDbData): IBooking {
    return Object.assign({ id: this.fromObjectId(bookingDbData._id) }, this.toBaseEntity(bookingDbData))
  }

  fromEntityCollection(bookingCollection: IBookingCollection): IBookingCollectionDbData {
    return bookingCollection.map((booking: IBooking): IBookingDbData => {
      return this.fromEntity(booking)
    })
  }

  toEntityCollection(bookingCollectionDbData: IBookingCollectionDbData): IBookingCollection {
    return bookingCollectionDbData.map((bookingDbData: IBookingDbData): IBooking => {
      return this.toEntity(bookingDbData)
    })
  }
}

export {
  BookingMongoDataMapper,
}
