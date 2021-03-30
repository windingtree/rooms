import { MongoDB } from '../../infra/mongo'

import { ENV } from '../../common/env'
import { IHealthStatusMongo, IHealthStatus } from '../../common/types'

async function getHealth(): Promise<IHealthStatus> {
  let mongoStatus = 'up'
  let pingErr: unknown|null = null

  const startTime = process.hrtime()
  try {
    await MongoDB.getInstance().ping()
  } catch (err: unknown) {
    mongoStatus = 'down'
    pingErr = err
  }
  const endTime: [number, number] = process.hrtime(startTime)
  const timeInMs: number = (endTime[0] * 1000000000 + endTime[1]) / 1000000

  const mongoStatusObj: IHealthStatusMongo = {
    status: mongoStatus,
    latency: (mongoStatus === 'up') ? `${timeInMs}ms` : undefined,
  }

  if (pingErr !== null) {
    mongoStatusObj.err = pingErr
  }


  return {
    mongo: mongoStatusObj,
    app_version: `${ENV.VERCEL_GITHUB_COMMIT_REF}:${ENV.VERCEL_GITHUB_COMMIT_SHA}`,
  }
}

export { getHealth }
