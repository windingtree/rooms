import { NowRequest, NowResponse } from '@vercel/node'

import { authenticateApiTestRequest, generateJwtToken } from '../../_lib/app/api_test'
import { genericApiMethodHandler } from '../../_lib/tools'
import { postJwtPayloadValidator } from '../../_lib/validators'
import { IProfileAuthData, IJwtToken } from '../../_lib/types'

async function POST(request: NowRequest): Promise<IJwtToken> {
  await authenticateApiTestRequest(request)

  const payload: IProfileAuthData = await postJwtPayloadValidator(request)

  return await generateJwtToken(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
