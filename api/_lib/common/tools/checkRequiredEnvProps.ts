// infrastructure layer imports
import { ENV } from '../../common/env'

// common imports
import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IEnvVariables } from '../../common/types'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function checkRequiredEnvProps(): Promise<void> {
  const requiredEnvProps: Array<keyof IEnvVariables> = [
    'VERCEL_GITHUB_COMMIT_REF',
    'VERCEL_GITHUB_COMMIT_SHA',

    'ENV_ENCRYPTION_DETAILS',

    'REACT_APP_JWT_SECRET',

    'MONGODB_URL',
    'ROOMS_DB_NAME',
  ]

  for (let c1 = 0; c1 < requiredEnvProps.length; c1 += 1) {
    const prop: keyof IEnvVariables = requiredEnvProps[c1]

    if (typeof ENV[prop] !== 'string' || ENV[prop] === '') {
      throw new CError(INTERNAL_SERVER_ERROR, `ENV variable '${prop}' is not set.`)
    }
  }
}

export {
  checkRequiredEnvProps,
}
