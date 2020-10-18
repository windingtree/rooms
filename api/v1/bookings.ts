import { NowRequest, NowResponse } from '@vercel/node'

import { getUserAuthDetails, genericApiMethodHandler, DB, CError, errorHandler } from '../tools'
import { checkBooking } from '../validators'
import { IUserAuthDetails, IBaseBooking, IBooking, IBookingCollection } from '../types'
import { ROOMS_DB_NAME } from '../constants'

async function getBookings(email: string): Promise<IBookingCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let bookingCollection: IBookingCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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

async function createBooking(email: string, newBooking: IBaseBooking): Promise<IBooking> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let bookingCollection: IBookingCollection
  try {
    bookingCollection = await getBookings(userAuthDetails.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(bookingCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    checkBooking(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const checkInDate: string = request.body.checkInDate
  const checkOutDate: string = request.body.checkOutDate
  const guestName: string = request.body.guestName
  const guestEmail: string = request.body.guestEmail
  const phoneNumber: string = request.body.phoneNumber
  const roomType: string = request.body.roomType

  let booking: IBooking
  try {
    booking = await createBooking(userAuthDetails.email, {
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
      phoneNumber,
      roomType,
    })
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(booking)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, POST })
}
