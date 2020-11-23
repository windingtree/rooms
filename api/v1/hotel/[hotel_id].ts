import { NowRequest, NowResponse } from '@vercel/node'

import { getHotel, updateHotel, deleteHotel } from '../../_lib/app/hotel'
import { genericApiMethodHandler, errorHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchHotelPayloadValidator } from '../../_lib/validators'
import { IProfile, IHotel, IPatchHotelPayload } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'hotel/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotelId: string
  try {
    hotelId = getQueryParamValue(request, 'hotel_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotel
  try {
    result = await getHotel(requester, hotelId)
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
    await authorizeRequest(requester.role, { method: 'PATCH', route: 'hotel/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotelId: string
  try {
    hotelId = getQueryParamValue(request, 'hotel_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IPatchHotelPayload
  try {
    data = await patchHotelPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotel
  try {
    result = await updateHotel(requester, hotelId, data)
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
    await authorizeRequest(requester.role, { method: 'DELETE', route: 'hotel/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotelId: string
  try {
    hotelId = getQueryParamValue(request, 'hotel_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteHotel(requester, hotelId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deletedCount: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
