import { ObjectID } from 'mongodb'

interface IBaseRoomType {
  hotelId: string
  type: string
  description: string
  quantity: number
  price: number
  amenities: string
  imageUrl: string
}

interface IRoomType extends IBaseRoomType {
  id: string
}

type IRoomTypeCollection = Array<IRoomType>

interface IPostRoomTypePayload {
  hotelId: string
  type?: string
  description?: string
  quantity?: number
  price?: number
  amenities?: string
  imageUrl?: string
}

interface IPatchRoomTypePayload {
  hotelId?: string
  type?: string
  description?: string
  quantity?: number
  price?: number
  amenities?: string
  imageUrl?: string
}

interface IBaseRoomTypeDbRecord {
  hotelId: ObjectID|null
  type: string
  description: string
  quantity: number
  price: number
  amenities: string
  imageUrl: string
}

interface IRoomTypeDbRecord extends IBaseRoomTypeDbRecord {
  _id: ObjectID|null
}

interface IPatchRoomTypePayloadDbData {
  hotelId?: ObjectID|null
  type?: string
  description?: string
  quantity?: number
  price?: number
  amenities?: string
  imageUrl?: string
}

type IRoomTypeDbRecordCollection = Array<IRoomTypeDbRecord>

export {
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
  IPostRoomTypePayload,
  IPatchRoomTypePayload,
  IBaseRoomTypeDbRecord,
  IRoomTypeDbRecord,
  IPatchRoomTypePayloadDbData,
  IRoomTypeDbRecordCollection,
}
