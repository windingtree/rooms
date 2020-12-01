import { NowRequest, NowResponse } from '@vercel/node'

import { createOrder } from '../../_lib/app/orgid'

import { authenticateOrgIdRequest } from '../../_lib/app/auth'
import { genericApiMethodHandler, errorHandler } from '../../_lib/tools'
import { postCreateOrderPayloadValidator } from '../../_lib/validators'
import { IOrgDetails, IPostCreateOrderPayload, ICreateOrderResult } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IOrgDetails
  try {
    requester = await authenticateOrgIdRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPostCreateOrderPayload
  try {
    payload = await postCreateOrderPayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: ICreateOrderResult
  try {
    result = await createOrder(requester, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
