import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IDecodedAuthToken {
  [field: string]: string
  email: string
  oneTimePassword: string
  sessionToken: string
}

export {
  IDecodedAuthToken,
}
