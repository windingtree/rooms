import { ObjectID } from 'mongodb'

type THotelDbDataFields =
  | '_id'
  | 'ownerId'
  | 'managers'
  | 'name'
  | 'description'
  | 'address'
  | 'location'
  | 'imageUrl'
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
  managers: Array<string>
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
  managers?: Array<string>
  name?: string
  description?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
  email?: string
}

interface IPatchHotelPayload {
  ownerId?: string
  managers?: Array<string>
  name?: string
  description?: string
  address?: string
  location?: IHotelLocation
  imageUrl?: string
  email?: string
}

interface IBaseHotelDbData {
  ownerId: ObjectID|null
  managers: Array<ObjectID>
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
  managers?: Array<ObjectID>
  name?: string
  description?: string
  address?: string
  location?: IHotelDbLocation
  imageUrl?: string
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
