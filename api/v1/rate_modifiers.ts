import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { getAllRateModifiers } from '../_lib/app/rate_modifier/'

import { IProfile, IRateModifierCollection } from '../_lib/common/types'

async function GET(request: NowRequest): Promise<IRateModifierCollection> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'room_types' })

  return await getAllRateModifiers(requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
