import { NowRequest, NowResponse } from '@vercel/node'

import { getHotel, updateHotel, deleteHotel } from '../../_lib/app/hotel'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchHotelPayloadValidator } from '../../_lib/validators'
import { IProfile, IHotel, IPatchHotelPayload, IStatus } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  return await getHotel(requester, hotelId)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  const data: IPatchHotelPayload = await patchHotelPayloadValidator(request)

  return await updateHotel(requester, hotelId, data)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  await deleteHotel(requester, hotelId)

  return { status: 'OK' }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
