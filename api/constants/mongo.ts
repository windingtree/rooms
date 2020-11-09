import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const MONGODB_URL: string = process.env.MONGODB_URL || ''
const ROOMS_DB_NAME: string = process.env.ROOMS_DB_NAME || ''

export {
  MONGODB_URL,
  ROOMS_DB_NAME,
}
