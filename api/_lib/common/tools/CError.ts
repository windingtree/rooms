// common imports
import { IHttpStatusCode } from '../../common/types'

class CError {
  statusCode: keyof IHttpStatusCode
  msg: string
  originalError: unknown

  constructor(_statusCode: keyof IHttpStatusCode, _msg: string, _originalError: unknown|null = null) {
    this.statusCode = _statusCode
    this.msg = _msg
    this.originalError = _originalError
  }
}

export {
  CError,
}
