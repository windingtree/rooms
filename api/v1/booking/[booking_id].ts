import { NowRequest, NowResponse } from '@vercel/node'

import { getBooking, updateBooking, deleteBooking } from '../../_lib/app/Booking'
import { genericApiMethodHandler, errorHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchBookingPayloadValidator } from '../../_lib/validators'
import { IProfile, IBooking, IPatchBookingPayload } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'booking/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let bookingId: string
  try {
    bookingId = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IBooking
  try {
    result = await getBooking(requester, bookingId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'PATCH', route: 'booking/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let bookingId: string
  try {
    bookingId = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IPatchBookingPayload
  try {
    data = await patchBookingPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IBooking
  try {
    result = await updateBooking(requester, bookingId, data)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'DELETE', route: 'booking/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let bookingId: string
  try {
    bookingId = getQueryParamValue(request, 'booking_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteBooking(requester, bookingId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deletedCount: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
