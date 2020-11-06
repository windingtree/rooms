import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const API_TEST_ENABLED = process.env.API_TEST_ENABLED || ''

const API_TEST_EMAIL = process.env.API_TEST_EMAIL || ''
const API_TEST_ONE_TIME_PASSWORD = process.env.API_TEST_ONE_TIME_PASSWORD || ''
const API_TEST_SESSION_TOKEN = process.env.API_TEST_SESSION_TOKEN || ''

export {
  API_TEST_ENABLED,

  API_TEST_EMAIL,
  API_TEST_ONE_TIME_PASSWORD,
  API_TEST_SESSION_TOKEN,
}
