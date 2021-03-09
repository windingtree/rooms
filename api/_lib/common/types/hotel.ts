import { ObjectID } from 'mongodb'

type THotelDbDataFields =
  | '_id'
  | 'ownerId'
  | 'name'
  | 'description'
  | 'address'
  | 'location'
  | 'images'
  | 'email'

type IHotelDbDataProjection = {
  [key in THotelDbDataFields]?: 1
}

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
  images: Array<string>
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
  images?: Array<string>
  email?: string
}

interface IPatchHotelPayload {
  ownerId?: string
  name?: string
  description?: string
  address?: string
  location?: IHotelLocation
  images?: Array<string>
  email?: string
}

interface IBaseHotelDbData {
  ownerId: ObjectID|null
  name: string
  description: string
  address: string
  location: IHotelDbLocation
  images?: Array<string>
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
  images?: Array<string>
  email?: string
}

type IHotelCollectionDbData = Array<IHotelDbData>

export {
  THotelDbDataFields,
  IHotelDbDataProjection,
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
