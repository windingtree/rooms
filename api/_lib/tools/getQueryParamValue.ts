import { NowRequest } from '@vercel/node'

import { CError } from '../tools'

function getQueryParamValue(request: NowRequest, queryParamName: string): string {
  const queryParamValue = request.query[queryParamName]

  if (
    (typeof queryParamValue !== 'string') ||
    (queryParamValue.length === 0)
  ) {
    throw new CError(500, `Query param '${queryParamName}' is not set.`)
  }

  return queryParamValue
}

export {
  getQueryParamValue,
}
