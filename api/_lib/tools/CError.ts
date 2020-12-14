import { IHttpStatusCodes } from '../../_lib/types'

class CError {
  statusCode: keyof IHttpStatusCodes
  msg: string
  originalError: unknown

  constructor(_statusCode: keyof IHttpStatusCodes, _msg: string, _originalError: unknown|null = null) {
    this.statusCode = _statusCode
    this.msg = _msg
    this.originalError = _originalError
  }
}

export {
  CError,
}
