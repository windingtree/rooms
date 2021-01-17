// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/interface'
import { patchHotelPayloadValidator } from '../../_lib/interface/validators'

// application layer imports
import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { getHotel, updateHotel, deleteHotel } from '../../_lib/app/hotel'

// common imports
import { IProfile, IHotel, IPatchHotelPayload, IStatus } from '../../_lib/common/types'

async function GET(request: NowRequest): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  return await getHotel(requester, hotelId)
}

async function PATCH(request: NowRequest): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  const payload: IPatchHotelPayload = await patchHotelPayloadValidator(request)

  return await updateHotel(requester, hotelId, payload)
}

async function DELETE(request: NowRequest): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  return await deleteHotel(requester, hotelId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
