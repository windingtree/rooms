// common imports
import { IEnvVariables } from '../../common/types'

import {
  VERCEL_GITHUB_COMMIT_REF,
  VERCEL_GITHUB_COMMIT_SHA,
} from './vercel'

import {
  ENV_ENCRYPTION_DETAILS,
} from './crypto'

import {
  REACT_APP_JWT_SECRET,
} from './react_app'

import {
  MONGODB_URL,
  ROOMS_DB_NAME,
} from './mongo'

const ENV: IEnvVariables = {
  VERCEL_GITHUB_COMMIT_REF,
  VERCEL_GITHUB_COMMIT_SHA,

  ENV_ENCRYPTION_DETAILS,

  REACT_APP_JWT_SECRET,

  MONGODB_URL,
  ROOMS_DB_NAME,
}

export {
  ENV,
}
