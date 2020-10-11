import { NowRequest, NowResponse } from '@vercel/node'

import { getUserAuthDetails, genericApiMethodHandler, DB } from '../tools'
import { checkBooking } from '../validators'
import { IUserAuthDetails, IBaseBooking, IBooking, IBookingCollection } from '../types'

async function getBookings(email: string): Promise<IBookingCollection> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  let bookingCollection: IBookingCollection
  try {
    const database = dbClient.db('rooms-staging')
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
    throw 'An error occurred while getting bookings.'
  }

  return bookingCollection
}

async function createBooking(email: string, newBooking: IBaseBooking): Promise<IBooking> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  let booking: IBooking
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('bookings')

    const doc = Object.assign({ email }, newBooking)
    const result = await collection.insertOne(doc)

    if (!result) {
      throw 'An error occurred while creating a new booking.'
    }

    booking = Object.assign({ id: result.insertedId }, newBooking)
  } catch (err) {
    throw 'An error occurred while creating a new booking.'
  }

  return booking
}

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  let bookingCollection: IBookingCollection
  try {
    bookingCollection = await getBookings(userAuthDetails.email)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json(bookingCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  try {
    checkBooking(request)
  } catch (err) {
    response.status(500).json({ err })
    return
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
    response.status(500).json({ err })
    return
  }

  response.status(200).json(booking)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, POST })
}
