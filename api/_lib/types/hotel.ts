import { ObjectID } from 'mongodb'

interface IHotelLocation {
  lat: number
  lng: number
}

interface IHotelDbLocation {
  type: string
  coordinates: Array<number>
}

interface IBaseHotel {
  ownerId: string
  name: string
  address: string
  location: IHotelLocation
  imageUrl: string
  email: string
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
  email?: string
}

interface IPatchHotelPayload {
  ownerId?: string
  name?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
  email?: string
}

interface IBaseHotelDbRecord {
  ownerId: ObjectID|null
  name: string
  address: string
  location: IHotelDbLocation
  imageUrl: string
  email: string
}

interface IHotelDbRecord extends IBaseHotelDbRecord {
  _id: ObjectID|null
}

interface IPatchHotelPayloadDbData {
  ownerId?: ObjectID|null
  name?: string
  address?: string
  location?: IHotelDbLocation
  imageUrl?: string
  email?: string
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
