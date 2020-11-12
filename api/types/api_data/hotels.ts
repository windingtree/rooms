import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IHotelPostDataLocation {
  lat: number
  lng: number
}

interface IHotelPostData {
  name: string
  address: string
  location: IHotelPostDataLocation
}

interface IHotelGetData {
  id: string
}

interface IHotelPutData {
  name?: string
  address?: string
  location?: IHotelPostDataLocation
}

interface IHotelDeleteData {
  id: string
}

export {
  IHotelPostDataLocation,
  IHotelPostData,
  IHotelGetData,
  IHotelPutData,
  IHotelDeleteData,
}
