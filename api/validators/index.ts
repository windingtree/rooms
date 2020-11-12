import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

export {
  checkRoomType,
} from './room_type'

export {
  checkBooking,
} from './booking'

export {
  checkLogin,
} from './login'

export {
  checkSendOneTimePass,
} from './send_one_time_pass'

export {
  checkProfilePatchData,
} from './profile'

export {
  hotelPostValidator,
} from './hotelPostValidator'
