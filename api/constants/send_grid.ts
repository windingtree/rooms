import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const SENDGRID_CALLBACK_URL = process.env.SENDGRID_CALLBACK_URL || ''

export {
  SENDGRID_API_KEY,
  SENDGRID_CALLBACK_URL,
}
