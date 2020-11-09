import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const API_DOC_URL: string = process.env.API_DOC_URL || ''

export {
  API_DOC_URL,
}
