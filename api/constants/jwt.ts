import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const JWT_SECRET: string = process.env.REACT_APP_JWT_SECRET || ''

export {
  JWT_SECRET,
}
