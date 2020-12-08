import { NowRequest, NowResponse } from '@vercel/node'

import { offerSearch } from '../../_lib/app/orgid'

import { authenticateOrgIdRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler } from '../../_lib/tools'
import { IOfferSearchResults } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<IOfferSearchResults> {
  await authenticateOrgIdRequest(request)

  return await offerSearch(request)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
