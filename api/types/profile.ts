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

export {
  IHotelLocation,
  IProfile,
}
