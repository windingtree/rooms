import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const API_HOST_URL = process.env.API_HOST_URL || ''
const MONGODB_URL = process.env.MONGODB_URL || ''

export {
  API_HOST_URL,
  MONGODB_URL,
}
