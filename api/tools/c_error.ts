import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

class CError {
  code: number
  msg: string

  constructor(code: number, msg: string) {
    this.code = code
    this.msg = msg
  }
}

export {
  CError,
}
