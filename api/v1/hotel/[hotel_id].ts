import { NowRequest, NowResponse } from '@vercel/node'

import {
  readHotel,
  readHotelByOwnerId,
  updateHotel,
  updateHotelByOwnerId,
  deleteHotel,
  deleteHotelByOwnerId,
} from '../../_lib/data/hotel'
import {
  genericApiMethodHandler,
  errorHandler,
  authorizeRequest,
  getQueryParamValue
} from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { hotelDataValidatorUpdate } from '../../_lib/validators'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IProfile, IHotel, IUpdateHotelData } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(profile.role, { method: 'GET', route: 'hotel/{id}' })
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
    if (profile.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN) {
      result = await readHotel(hotelId)
    } else {
      result = await readHotelByOwnerId(hotelId, profile.id)
    }
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(profile.role, { method: 'PATCH', route: 'hotel/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let hotelId: string
  try {
    hotelId = getQueryParamValue(request, 'hotel_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IUpdateHotelData
  try {
    data = await hotelDataValidatorUpdate(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    if (profile.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN) {
      await updateHotel(hotelId, data)
    } else {
      await updateHotelByOwnerId(hotelId, profile.id, data)
    }
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotel
  try {
    if (profile.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN) {
      result = await readHotel(hotelId)
    } else {
      result = await readHotelByOwnerId(hotelId, profile.id)
    }
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(profile.role, { method: 'DELETE', route: 'hotel/{id}' })
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
    if (profile.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN) {
      await deleteHotel(hotelId)
    } else {
      await deleteHotelByOwnerId(hotelId, profile.id)
    }
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deleted: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
