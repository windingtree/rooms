import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../../_lib/interface'
import { postJwtPayloadValidator } from '../../_lib/interface/validators'

import { authenticateApiTestRequest, generateJwtToken } from '../../_lib/app/api_test'

import { IProfileAuthData, IJwtToken } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IJwtToken> {
  await authenticateApiTestRequest(request)

  const payload: IProfileAuthData = await postJwtPayloadValidator(request)

  return await generateJwtToken(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
