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

interface IPostHotelPayload {
  ownerId: string
  name?: string
  address?: string
  location?: IHotelLocation
}

interface IPatchHotelPayload {
  ownerId?: string
  name?: string
  address?: string
  location?: IHotelLocation
}

type IHotelCollection = Array<IHotel>

interface IHotelDbRecord extends IBaseHotel {
  _id: string
}

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IPostHotelPayload,
  IHotelCollection,
  IHotelDbRecord,
  IPatchHotelPayload,
}
