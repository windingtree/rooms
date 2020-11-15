import { ObjectID } from 'mongodb'

import { CError } from '../../tools'
import { IBooking, IBaseBooking, IBookingCollection } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function createBooking(email: string, newBooking: IBaseBooking): Promise<IBooking> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('bookings')

    const doc = Object.assign({ email }, newBooking)
    result = await collection.insertOne(doc)
  } catch (err) {
    throw new CError(500, 'An error occurred while creating a new booking.')
  }

  if (!result) {
    throw new CError(500, 'Could not create a new booking.')
  }

  const booking: IBooking = Object.assign({ id: result.insertedId }, newBooking)

  return booking
}

async function getBooking(id: string): Promise<IBooking> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('bookings')

    const query = { _id: new ObjectID(id) }
    const options = {
      projection: {
        _id: 1,
        email: 1,
        checkInDate: 1,
        checkOutDate: 1,
        guestName: 1,
        guestEmail: 1,
        phoneNumber: 1,
        roomType: 1,
      }
    }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while getting a booking.')
  }

  if (result === null) {
    throw new CError(500, `Could not find a booking with ID '${id}'.`)
  }

  return {
    id: result._id,
    checkInDate: result.checkInDate,
    checkOutDate: result.checkOutDate,
    guestName: result.guestName,
    guestEmail: result.guestEmail,
    phoneNumber: result.phoneNumber,
    roomType: result.roomType,
  }
}

async function updateBooking(id: string, email: string, booking: IBaseBooking): Promise<IBooking> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('bookings')

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }
    const updateDoc = {
      $set: Object.assign({ email }, booking)
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while updating a booking.')
  }

  if (!result || !result.matchedCount) {
    throw new CError(500, `Could not find a booking to update with ID '${id}'.`)
  }

  return Object.assign({ id }, booking)
}

async function deleteBooking(id: string): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('bookings')

    const filter = { _id: new ObjectID(id) }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(500, 'An error occurred while deleting a booking.')
  }

  if (!result || !result.deletedCount) {
    throw new CError(500, `Could not find a booking to delete with ID '${id}'.`)
  }
}

async function getBookings(email: string): Promise<IBookingCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let bookingCollection: IBookingCollection
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection('bookings')

    const query = { email }

    const options = {
      sort: { createdAt: 1 },
      projection: {
        _id: 1,
        email: 1,
        checkInDate: 1,
        checkOutDate: 1,
        guestName: 1,
        guestEmail: 1,
        phoneNumber: 1,
        roomType: 1,
      }
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }

    bookingCollection = []
    await cursor.forEach((item) => {
      bookingCollection.push({
        id: item._id,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        guestName: item.guestName,
        guestEmail: item.guestEmail,
        phoneNumber: item.phoneNumber,
        roomType: item.roomType,
      })
    })
  } catch (err) {
    throw new CError(500, 'An error occurred while getting bookings.')
  }

  return bookingCollection
}

export {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookings,
}
