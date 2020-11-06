import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IHotelLocation {
  lat: number
  lng: number
}

interface IProfile {
  email: string
  hotelName: string
  hotelAddress: string
  hotelLocation: IHotelLocation
}

interface IExtendedProfile extends IProfile {
  oneTimePassword: string
  sessionToken: string
}

export {
  IHotelLocation,
  IProfile,
  IExtendedProfile,
}
