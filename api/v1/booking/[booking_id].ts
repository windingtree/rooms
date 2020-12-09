import { NowRequest, NowResponse } from '@vercel/node'

import { getBooking, updateBooking, deleteBooking } from '../../_lib/app/Booking'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { patchBookingPayloadValidator } from '../../_lib/validators'
import { IProfile, IBooking, IPatchBookingPayload, IStatus } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  return await getBooking(requester, bookingId)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  const data: IPatchBookingPayload = await patchBookingPayloadValidator(request)

  return await updateBooking(requester, bookingId, data)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  await deleteBooking(requester, bookingId)

  return { status: 'OK' }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
