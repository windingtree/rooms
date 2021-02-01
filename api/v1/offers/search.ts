import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../../_lib/interface'

import { authenticateOrgIdRequest } from '../../_lib/app/auth/orgid'
import { offerSearch } from '../../_lib/app/orgid'

import { IOfferSearchResults, IOrgDetails } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IOfferSearchResults> {
  const requester: IOrgDetails = await authenticateOrgIdRequest(request)

  return await offerSearch(request, requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
