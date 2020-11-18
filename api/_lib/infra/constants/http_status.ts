import { IHttpStatus } from '../../types'

const HTTP_STATUS: IHttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
}

export {
  HTTP_STATUS,
}
