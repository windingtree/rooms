import { NowRequest, NowResponse } from '@vercel/node'

import { createHotel } from '../_lib/data/hotel'
import { updateProfile } from '../_lib/data/profile'
import { authenticateClientAppUser } from '../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../_lib/tools'
import { checkLogin } from '../_lib/validators'
import { IProfile, IHotel } from '../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await checkLogin(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const oneTimePassword: string = request.body.oneTimePassword
  const sessionToken: string = request.body.sessionToken

  let profile: IProfile
  try {
    profile = await authenticateClientAppUser(email, oneTimePassword, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  if (typeof profile.hotelId !== 'string' || profile.hotelId === '') {
    let hotel: IHotel
    try {
      hotel = await createHotel({ ownerId: profile.id, name: '', address: '', location: { lat: 0, lng: 0 } })
    } catch (err) {
      return errorHandler(response, err)
    }

    profile.hotelId = hotel.id
    try {
      updateProfile(profile.id, Object.assign({}, profile, { id: undefined }))
    } catch (err) {
      return errorHandler(response, err)
    }
  }

  response.status(200).json(profile)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
