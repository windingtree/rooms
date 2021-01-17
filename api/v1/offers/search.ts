// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../../_lib/interface'

// application layer imports
import { authenticateOrgIdRequest } from '../../_lib/app/auth/orgid'
import { offerSearch } from '../../_lib/app/orgid'

// common imports
import { IOfferSearchResults, IOrgDetails } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IOfferSearchResults> {
  const requester: IOrgDetails = await authenticateOrgIdRequest(request)

  return await offerSearch(request, requester)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
