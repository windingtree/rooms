import { ObjectID } from 'mongodb'

interface IHotelLocation {
  lat: number
  lng: number
}

interface IBaseHotel {
  ownerId: string
  name: string
  address: string
  location: IHotelLocation
  imageUrl: string
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
  imageUrl?: string
}

interface IPatchHotelPayload {
  ownerId?: string
  name?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
}

interface IBaseHotelDbRecord {
  ownerId: ObjectID|null
  name: string
  address: string
  location: IHotelLocation
  imageUrl: string
}

interface IHotelDbRecord extends IBaseHotelDbRecord {
  _id: ObjectID|null
}

interface IPatchHotelPayloadDbData {
  ownerId?: ObjectID|null
  name?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
}

type IHotelDbRecordCollection = Array<IHotelDbRecord>

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPostHotelPayload,
  IPatchHotelPayload,
  IBaseHotelDbRecord,
  IHotelDbRecord,
  IPatchHotelPayloadDbData,
  IHotelDbRecordCollection,
}
