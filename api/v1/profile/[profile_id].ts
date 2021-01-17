// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/interface'
import { patchProfilePayloadValidator } from '../../_lib/interface/validators'

// application layer imports
import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { getProfile, updateProfile, deleteProfile } from '../../_lib/app/profile'

// common imports
import { IProfile, IPatchProfilePayload, IStatus } from '../../_lib/common/types'

async function GET(request: NowRequest): Promise<IProfile> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  return await getProfile(requester, profileId)
}

async function PATCH(request: NowRequest): Promise<IProfile> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  const payload: IPatchProfilePayload = await patchProfilePayloadValidator(request)

  return await updateProfile(requester, profileId, payload)
}

async function DELETE(request: NowRequest): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'profile/{id}' })

  const profileId: string = getQueryParamValue(request, 'profile_id')

  return await deleteProfile(requester, profileId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
