// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../../_lib/interface'
import { postJwtPayloadValidator } from '../../_lib/interface/validators'

// application layer imports
import { authenticateApiTestRequest, generateJwtToken } from '../../_lib/app/api_test'

// common imports
import { IProfileAuthData, IJwtToken } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IJwtToken> {
  await authenticateApiTestRequest(request)

  const payload: IProfileAuthData = await postJwtPayloadValidator(request)

  return await generateJwtToken(payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
