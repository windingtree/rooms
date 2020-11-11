import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

export {
  TMethodFunc,
  IMethodHandlerHash,
} from './api'

export {
  IDecodedAuthToken,
  IUserAuthDetails,
} from './auth'

export {
  IAnyObject,
  IObjectHash,
} from './base'

export {
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
} from './room_type'

export {
  IBaseBooking,
  IBooking,
  IBookingCollection,
} from './booking'

export {
  IHotelLocation,
  IProfileAuth,
  IProfileData,
  IExtendedProfile,
  IProfileDataCollection,
} from './profile'

export {
  IOrgDetails,
  IDecodedOrgToken,
  IVerifiedOrgJwtResults,
} from './orgid'

export {
  IAppConfig,
  IAppConfigDbItem,
} from './app_config'
