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

interface IHotelDbRecord extends IBaseHotel {
  _id: string
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
  IHotelDbRecord,
  IHotelCollection,
  IUpdateHotelData,
}
