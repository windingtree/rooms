import { NowRequest, NowResponse } from '@vercel/node'

import { getProfile, patchProfile } from '../app'
import { getUserAuthDetails, genericApiMethodHandler, errorHandler } from '../tools'
import { checkProfilePatchData } from '../validators'
import { IUserAuthDetails, IProfile } from '../types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let profile: IProfile
  try {
    profile = await getProfile(userAuthDetails.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profile)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
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
    await patchProfile(userAuthDetails.email, property, value)
  } catch (err) {
    return errorHandler(response, err)
  }

  let profile: IProfile
  try {
    profile = await getProfile(userAuthDetails.email)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(profile)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH })
}
