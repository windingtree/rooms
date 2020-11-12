import { NowRequest, NowResponse } from '@vercel/node'

import { createBooking, getBookings } from '../_lib/data/rooms_legacy'
import { authenticateRequest, genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { checkBooking } from '../_lib/validators'
import { IProfile, IBooking, IBookingCollection } from '../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let bookingCollection: IBookingCollection
  try {
    bookingCollection = await getBookings(profile.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(bookingCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await checkBooking(request)
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
    booking = await createBooking(profile.email, {
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
