import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IHotelLocation {
  lat: number
  lng: number
}

interface IProfileAuth {
  email: string
  oneTimePassword: string
  sessionToken: string
}

interface IProfileData {
  email: string
  hotelName: string
  hotelAddress: string
  hotelLocation: IHotelLocation
}

interface IExtendedProfile extends IProfileAuth, IProfileData {}

export {
  IHotelLocation,
  IProfileAuth,
  IProfileData,
  IExtendedProfile,
}
