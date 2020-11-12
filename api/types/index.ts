import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

export {
  TMethodFunc,
  IMethodHandlerHash,
} from './api'

export {
  IDecodedAuthToken,
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
  IBaseProfile
  IProfile,
  IProfileCollection,
  IUpdateProfileData,
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

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IHotelCollection,
  IUpdateHotelData,
} from './hotels'

export {
  IHotelPostDataLocation,
  IHotelPostData,
  IHotelGetData,
  IHotelPutData,
  IHotelDeleteData,
} from './api_data'
