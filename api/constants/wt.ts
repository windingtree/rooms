import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const WT_VERIFICATION_CODE: string = process.env.WT_VERIFICATION_CODE || ''
const WT_THEGRAPH_API_URL: string = process.env.WT_THEGRAPH_API_URL || ''

export {
  WT_VERIFICATION_CODE,
  WT_THEGRAPH_API_URL,
}
