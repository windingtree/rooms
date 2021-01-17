// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../../_lib/interface'

// application layer imports
import { authenticateApiTestRequest, apiTestSetup } from '../../_lib/app/api_test'

// common imports
import { IProfile } from '../../_lib/common/types'

async function POST(request: NowRequest): Promise<IProfile> {
  await authenticateApiTestRequest(request)

  return await apiTestSetup()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
