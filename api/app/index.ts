import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

export {
  createRoomType,
  getRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypes,
} from './room_type'

export {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookings,
} from './booking'

export {
  checkIfUserAuthenticated,
} from './authentication'

export {
  getOneTimePassword,
} from './one_time_password'

export {
  pingDatabase,
} from './health'
