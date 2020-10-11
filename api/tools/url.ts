import { NowRequest } from '@vercel/node'

function getQueryParamValue(request: NowRequest, queryParamName: string): string {
  const queryParamValue = request.query[queryParamName]

  if (
    (typeof queryParamValue !== 'string') ||
    (queryParamValue.length === 0)
  ) {
    throw `Query param '${queryParamName}' is not set.`
  }

  return queryParamValue
}

export {
  getQueryParamValue,
}
