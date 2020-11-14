import { NowRequest, NowResponse } from '@vercel/node'

import { readHotels, readHotelsByOwnerId } from '../_lib/data'
import { authenticateRequest, genericApiMethodHandler, errorHandler, authorizeUser } from '../_lib/tools'
import { IProfile, IHotelCollection } from '../_lib/types'
import { CONSTANTS } from '../_lib/infra/constants'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profile.role, { method: 'GET', route: 'hotels' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IHotelCollection
  try {
    if (profile.role === CONSTANTS.PROFILE_ROLE.SUPER_ADMIN) {
      result = await readHotels()
    } else {
      result = await readHotelsByOwnerId(profile.id)
    }
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
