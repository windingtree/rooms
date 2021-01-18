import { NowRequest } from '@vercel/node'

import { CONSTANTS } from '../common/constants'
import { CError } from '../common/tools'

const { BAD_REQUEST }  = CONSTANTS.HTTP_STATUS

function getQueryParamValue(request: NowRequest, queryParamName: string): string {
  if (typeof request.query === 'undefined') {
    throw new CError(BAD_REQUEST, `Request query is not defined.`)
  }

  const queryParamValue = request.query[queryParamName]

  if (
    (typeof queryParamValue !== 'string') ||
    (queryParamValue.length === 0)
  ) {
    throw new CError(BAD_REQUEST, `Query param '${queryParamName}' is not set.`)
  }

  return queryParamValue
}

export { getQueryParamValue }
