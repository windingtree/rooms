interface IHttpStatusCodes {
  OK: number
  BAD_REQUEST: number
  UNAUTHORIZED: number
  FORBIDDEN: number
  NOT_FOUND: number
  METHOD_NOT_ALLOWED: number
  INTERNAL_SERVER_ERROR: number
  NOT_IMPLEMENTED: number
  BAD_GATEWAY: number
  SERVICE_UNAVAILABLE: number
}

interface IHttpStatus {
  OK: keyof IHttpStatusCodes
  BAD_REQUEST: keyof IHttpStatusCodes
  UNAUTHORIZED: keyof IHttpStatusCodes
  FORBIDDEN: keyof IHttpStatusCodes
  NOT_FOUND: keyof IHttpStatusCodes
  METHOD_NOT_ALLOWED: keyof IHttpStatusCodes
  INTERNAL_SERVER_ERROR: keyof IHttpStatusCodes
  NOT_IMPLEMENTED: keyof IHttpStatusCodes
  BAD_GATEWAY: keyof IHttpStatusCodes
  SERVICE_UNAVAILABLE: keyof IHttpStatusCodes
}

export {
  IHttpStatusCodes,
  IHttpStatus,
}
