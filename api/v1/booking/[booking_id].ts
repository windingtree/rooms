import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { getBooking, updateBooking, deleteBooking } from '../../_lib/app/Booking'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { patchBookingPayloadValidator } from '../../_lib/validators'
import { IProfile, IBooking, IPatchBookingPayload, IStatus } from '../../_lib/types'

async function GET(request: NowRequest): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  return await getBooking(requester, bookingId)
}

async function PATCH(request: NowRequest): Promise<IBooking> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  const payload: IPatchBookingPayload = await patchBookingPayloadValidator(request)

  return await updateBooking(requester, bookingId, payload)
}

async function DELETE(request: NowRequest): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'booking/{id}' })

  const bookingId: string = getQueryParamValue(request, 'booking_id')

  return await deleteBooking(requester, bookingId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
