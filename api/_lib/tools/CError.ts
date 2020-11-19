import { IHttpStatusCodes } from '../../_lib/types'

class CError {
  code: keyof IHttpStatusCodes
  msg: string

  constructor(code: keyof IHttpStatusCodes, msg: string) {
    this.code = code
    this.msg = msg
  }
}

export {
  CError,
}
