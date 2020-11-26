import { NowRequest, NowResponse } from '@vercel/node'

import { offerSearch } from '../../_lib/app/orgid'

import { authenticateOrgIdRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../../_lib/tools'
import { IOfferSearchResults } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await authenticateOrgIdRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IOfferSearchResults
  try {
    result = await offerSearch(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
