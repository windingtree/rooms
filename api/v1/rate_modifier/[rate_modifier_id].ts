import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/interface'
import { patchRateModifierPayloadValidator } from '../../_lib/interface/validators'

import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { getRateModifier, updateRateModifier, deleteRateModifier } from '../../_lib/app/rate_modifier'

import { IProfile, IRateModifier, IPatchRateModifierPayload, IStatus } from '../../_lib/common/types'

async function GET(request: NowRequest): Promise<IRateModifier> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'GET', route: 'rate_modifier/{id}' })

  const rateModifierId: string = getQueryParamValue(request, 'rate_modifier_id')

  return await getRateModifier(requester, rateModifierId)
}

async function PATCH(request: NowRequest): Promise<IRateModifier> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'rate_modifier/{id}' })

  const rateModifierId: string = getQueryParamValue(request, 'rate_modifier_id')

  const payload: IPatchRateModifierPayload = await patchRateModifierPayloadValidator(request)

  return await updateRateModifier(requester, rateModifierId, payload)
}

async function DELETE(request: NowRequest): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'rate_modifier/{id}' })

  const roomTypeId: string = getQueryParamValue(request, 'rate_modifier_id')

  return await deleteRateModifier(requester, roomTypeId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
