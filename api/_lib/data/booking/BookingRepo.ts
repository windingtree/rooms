import { Collection } from 'mongodb'

import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { BaseDataRepo } from '../../../_lib/tools'
import { TBookingDbDataFields, IBookingDbDataProjection, IBookingDbData } from '../../../_lib/types'

import {
  createBooking,
  deleteBooking,
  deleteBookingByHotelId,
  readBooking,
  readBookingByHotelId,
  readBookings,
  readBookingsByHotelId,
  updateBooking,
  updateBookingByHotelId,
} from './functions'

import { BookingMongoDataMapper } from './BookingMongoDataMapper'

class BookingRepo extends BaseDataRepo {
  protected mapper = new BookingMongoDataMapper()

  public createBooking = createBooking
  public deleteBooking = deleteBooking
  public deleteBookingByHotelId = deleteBookingByHotelId
  public readBooking = readBooking
  public readBookingByHotelId = readBookingByHotelId
  public readBookings = readBookings
  public readBookingsByHotelId = readBookingsByHotelId
  public updateBooking = updateBooking
  public updateBookingByHotelId = updateBookingByHotelId

  constructor() {
    super()

    this.ENTITY_NAME = 'booking'
    this.COLLECTION_NAME = 'bookings'
  }

  protected getProjection(): IBookingDbDataProjection {
    const allowedFields: Array<TBookingDbDataFields> = [
      '_id',
      'orderId',
      'hotelId',
      'checkInDate',
      'checkOutDate',
      'guestName',
      'guestEmail',
      'phoneNumber',
      'roomTypeId',
    ]

    return allowedFields.reduce((projection: IBookingDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IBookingDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export {
  BookingRepo,
}
