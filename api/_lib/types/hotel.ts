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
  description: string
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
  description?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
  email?: string
}

interface IPatchHotelPayload {
  ownerId?: string
  name?: string
  description?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
  email?: string
}

interface IBaseHotelDbData {
  ownerId: ObjectID|null
  name: string
  description: string
  address: string
  location: IHotelDbLocation
  imageUrl: string
  email: string
}

interface IHotelDbData extends IBaseHotelDbData {
  _id: ObjectID|null
}

interface IPatchHotelPayloadDbData {
  ownerId?: ObjectID|null
  name?: string
  description?: string
  address?: string
  location?: IHotelDbLocation
  imageUrl?: string
  email?: string
}

type IHotelCollectionDbData = Array<IHotelDbData>

export {
  IHotelLocation,
  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPostHotelPayload,
  IPatchHotelPayload,
  IBaseHotelDbData,
  IHotelDbData,
  IPatchHotelPayloadDbData,
  IHotelCollectionDbData,
}
