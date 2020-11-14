import { NowRequest, NowResponse } from '@vercel/node'

import {
  readProfile,
  updateProfile,
  deleteProfile,
} from '../../_lib/data'
import {
  authenticateRequest,
  genericApiMethodHandler,
  errorHandler,
  authorizeUser,
  getQueryParamValue,
  CError,
} from '../../_lib/tools'
import { profileDataValidatorUpdate } from '../../_lib/validators'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IProfile, IUpdateProfileData } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profile.role, { method: 'GET', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    if (profile.role !== CONSTANTS.PROFILE_ROLE.SUPER_ADMIN && profileId !== profile.id) {
      throw new CError(403, `User '${profile.email}' is not authorized to update a profile with id '${profileId}'.`)
    }

    result = await readProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profile.role, { method: 'PATCH', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let data: IUpdateProfileData
  try {
    data = await profileDataValidatorUpdate(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    if (profile.role !== CONSTANTS.PROFILE_ROLE.SUPER_ADMIN && profileId !== profile.id) {
      throw new CError(403, `User '${profile.email}' is not authorized to update a profile with id '${profileId}'.`)
    }

    await updateProfile(profileId, data)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await readProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  let profile: IProfile
  try {
    profile = await authenticateRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeUser(profile.role, { method: 'DELETE', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    if (profile.role !== CONSTANTS.PROFILE_ROLE.SUPER_ADMIN && profileId !== profile.id) {
      throw new CError(403, `User '${profile.email}' is not authorized to delete a profile with id '${profileId}'.`)
    }

    await deleteProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deleted: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
