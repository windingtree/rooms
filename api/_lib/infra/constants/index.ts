import {
  IConstants,
} from '../../../_lib/types'

import {
  PROFILE_ROLE,
} from './profile_role'

import {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
} from './http_status'

const CONSTANTS: IConstants = {
  PROFILE_ROLE,

  HTTP_STATUS_CODES,
  HTTP_STATUS,

  ONE_MONGO_CONNECTION_PER_REQUEST: false,
}

export {
  CONSTANTS,
}
