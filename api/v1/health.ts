// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../_lib/interface'

// application layer imports
import { getHealth } from '../_lib/app/health'

// common imports
import { IHealthStatus } from '../_lib/common/types'

async function GET(): Promise<IHealthStatus> {
  return await getHealth()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
