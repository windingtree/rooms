// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'

// application layer imports
import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllProfiles } from '../_lib/app/profile'

// common imports
import { IProfile, IProfileCollection } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IProfileCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'profiles' })

  return await getAllProfiles(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
