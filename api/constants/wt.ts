import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const WT_VERIFICATION_CODE: string = process.env.WT_VERIFICATION_CODE || ''
const WT_THEGRAPH_API_URL: string = process.env.WT_THEGRAPH_API_URL || ''
const WT_ROOMS_ORGID: string = process.env.WT_ROOMS_ORGID || ''

export {
  WT_VERIFICATION_CODE,
  WT_THEGRAPH_API_URL,
  WT_ROOMS_ORGID,
}
