import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest, getQueryParamValue } from '../../_lib/interface'
import { patchHotelPayloadValidator } from '../../_lib/interface/validators'

import { authenticateClientAppRequest } from '../../_lib/app/auth/client_app'
import { authenticateOrgIdRequest } from '../../_lib/app/auth/orgid'
import { getHotel, updateHotel, deleteHotel } from '../../_lib/app/hotel'

import { IProfile, IHotel, IPatchHotelPayload, IStatus, IOrgDetails } from '../../_lib/common/types'
import { CONSTANTS } from '../../_lib/common/constants'
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function GET(request: NowRequest): Promise<IHotel> {
  let orgId: IOrgDetails;
  try {
    orgId = await authenticateOrgIdRequest(request);
  } catch(error) {
    console.log('OrgId Auth error:', error);
  }
  const hotelId: string = getQueryParamValue(request, 'hotel_id')
  let requester: IProfile;

  console.log('orgId:', `[${process.env.MARKETPLACE_ORGID}]`, orgId);

  if (orgId && orgId.organization.id === process.env.MARKETPLACE_ORGID) {
    // Handling of the Marketplace request
    requester = {
      role: SUPER_ADMIN // workaround for getting hotel
    };
    return await getHotel(requester, hotelId)
  } else {
    // Handling of the Room App request
    requester = await authenticateClientAppRequest(request)
    await authorizeRequest(requester.role, { method: 'GET', route: 'hotel/{id}' })
    return await getHotel(requester, hotelId)
  }
}

async function PATCH(request: NowRequest): Promise<IHotel> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'PATCH', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  const payload: IPatchHotelPayload = await patchHotelPayloadValidator(request)

  return await updateHotel(requester, hotelId, payload)
}

async function DELETE(request: NowRequest): Promise<IStatus> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'DELETE', route: 'hotel/{id}' })

  const hotelId: string = getQueryParamValue(request, 'hotel_id')

  return await deleteHotel(requester, hotelId)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
