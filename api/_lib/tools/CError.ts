import { IHttpStatusCodes } from '../../_lib/types'

class CError {
  status: keyof IHttpStatusCodes
  msg: string

  constructor(code: keyof IHttpStatusCodes, msg: string) {
    this.status = code
    this.msg = msg
  }
}

export {
  CError,
}
