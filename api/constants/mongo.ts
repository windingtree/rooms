import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const ROOMS_DB_NAME: string = process.env.ROOMS_DB_NAME || ''

export {
  ROOMS_DB_NAME,
}
