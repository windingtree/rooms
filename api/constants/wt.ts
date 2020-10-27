import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const WT_VERIFICATION_CODE = process.env.WT_VERIFICATION_CODE || ''

export {
  WT_VERIFICATION_CODE,
}
