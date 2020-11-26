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

interface IBaseHotelDbRecord {
  ownerId: ObjectID|null
  name: string
  address: string
  location: IHotelLocation
}

interface IHotelDbRecord extends IBaseHotelDbRecord {
  _id: ObjectID|null
}

interface IPatchHotelPayloadDbData {
  ownerId?: ObjectID|null
  name?: string
  address?: string
  location?: IHotelLocation
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
