import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IHotelLocation {
  lat: number
  lng: number
}

interface IBaseHotel {
  ownerId: string
  name: string
  address: string
  location: IHotelLocation
}

interface IHotel extends IBaseHotel {
  id: string
}

type IHotelCollection = Array<IHotel>

interface IUpdateHotelData {
  ownerId?: string
  name?: string
  address?: string
  location?: IHotelLocation
}

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IHotelCollection,
  IUpdateHotelData,
}
