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

interface IHotelDbRecord extends IBaseHotel {
  _id: string
}

type IHotelDbRecordCollection = Array<IHotelDbRecord>

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPostHotelPayload,
  IPatchHotelPayload,
  IHotelDbRecord,
  IHotelDbRecordCollection,
}
