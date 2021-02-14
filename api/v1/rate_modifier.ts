import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { postRateModifierPayloadValidator } from '../_lib/interface/validators'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { createRateModifier } from '../_lib/app/rate_modifier'

import { IProfile, IRateModifier, IPostRateModifierPayload } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IRateModifier> {
    const requester: IProfile = await authenticateClientAppRequest(request)

    await authorizeRequest(requester.role, { method: 'POST', route: 'room_type' })

    const payload: IPostRateModifierPayload = await postRateModifierPayloadValidator(request)

    return await createRateModifier(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
    await genericApiMethodHandler(request, response, { POST })
}
