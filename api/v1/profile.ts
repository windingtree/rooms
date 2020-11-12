import { NowRequest, NowResponse } from '@vercel/node'

import { getProfile, patchProfile } from '../app/rooms'
import { getUserAuthDetails, genericApiMethodHandler, errorHandler } from '../tools'
import { checkProfilePatchData } from '../validators'
import { IProfileAuth, IProfileData } from '../types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profileAuth: IProfileAuth
  try {
    profileAuth = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileData: IProfileData
  try {
    profileData = await getProfile(profileAuth.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profileData)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let profileAuth: IProfileAuth
  try {
    profileAuth = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await checkProfilePatchData(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const property: string = request.body.property
  const value: string = request.body.value

  try {
    await patchProfile(profileAuth.email, property, value)
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileData: IProfileData
  try {
    profileData = await getProfile(profileAuth.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profileData)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH })
}
