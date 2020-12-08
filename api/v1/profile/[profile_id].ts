import { NowRequest, NowResponse } from '@vercel/node'

import { getProfile, updateProfile, deleteProfile } from '../../_lib/app/profile'
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchProfilePayloadValidator } from '../../_lib/validators'
import { IProfile, IPatchProfilePayload, IStatus } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<IProfile> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  return await getProfile(requester, profileId)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<IProfile> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  const data: IPatchProfilePayload = await patchProfilePayloadValidator(request)

  return await updateProfile(requester, profileId, data)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  await deleteProfile(requester, profileId)

  return { status: 'OK' }
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
