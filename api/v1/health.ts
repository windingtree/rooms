import { NowRequest, NowResponse } from '@vercel/node'

import { getHealth } from '../_lib/app/health'
import { genericApiMethodHandler } from '../_lib/tools'
import { IHealthStatus } from '../_lib/types'

async function GET(): Promise<IHealthStatus> {
  return await getHealth()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
