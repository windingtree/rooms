import { NowRequest, NowResponse } from '@vercel/node'

import { getBooking, updateBooking, deleteBooking } from '../../_lib/data/rooms_legacy'
import { authenticateRequest, genericApiMethodHandler, getQueryParamValue, errorHandler } from '../../_lib/tools'
import { checkBooking } from '../../_lib/validators'
import { IProfile, IBooking } from '../../_lib/types'

async function PUT(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
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
    await checkBooking(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = profile.email

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
    await authenticateRequest(request)
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
    await authenticateRequest(request)
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
