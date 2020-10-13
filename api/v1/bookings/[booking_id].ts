import { NowRequest, NowResponse } from '@vercel/node'
import { ObjectID } from 'mongodb'

import { getUserAuthDetails, DB, genericApiMethodHandler, getQueryParamValue, CError, errorHandler } from '../../tools'
import { checkBooking } from '../../validators'
import { IUserAuthDetails, IBaseBooking, IBooking } from '../../types'

async function updateBooking(id: string, email: string, booking: IBaseBooking): Promise<IBooking> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
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
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
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

async function getBooking(id: string): Promise<IBooking> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
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

async function PUT(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    checkBooking(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = userAuthDetails.email

  const checkInDate: string = request.body.checkInDate
  const checkOutDate: string = request.body.checkOutDate
  const guestName: string = request.body.guestName
  const guestEmail: string = request.body.guestEmail
  const phoneNumber: string = request.body.phoneNumber
  const roomType: string = request.body.roomType

  let booking: IBooking
  try {
    booking = await updateBooking(id, email, {
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

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let booking: IBooking
  try {
    booking = await getBooking(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(booking)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteBooking(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ id, deleted: true })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PUT, DELETE })
}
