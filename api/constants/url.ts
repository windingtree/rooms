import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const API_DOC_URL = process.env.API_DOC_URL || ''
const MONGODB_URL = process.env.MONGODB_URL || ''

export {
  API_DOC_URL,
  MONGODB_URL,
}
