import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IAnyObject {}

interface IObjectHash {
  [key: string]: string
}

export {
  IAnyObject,
  IObjectHash,
}
