import { ObjectID } from 'mongodb'

interface IBaseRoomType {
  hotelId: string
  type: string
  quantity: number
  price: number
  amenities: string
}

interface IRoomType extends IBaseRoomType {
  id: string
}

type IRoomTypeCollection = Array<IRoomType>

interface IPostRoomTypePayload {
  hotelId: string
  type?: string
  quantity?: number
  price?: number
  amenities?: string
}

interface IPatchRoomTypePayload {
  hotelId?: string
  type?: string
  quantity?: number
  price?: number
  amenities?: string
}

interface IBaseRoomTypeDbRecord {
  hotelId: ObjectID|null
  type: string
  quantity: number
  price: number
  amenities: string
}

interface IRoomTypeDbRecord extends IBaseRoomTypeDbRecord {
  _id: ObjectID|null
}

interface IPatchRoomTypePayloadDbData {
  hotelId?: ObjectID|null
  type?: string
  quantity?: number
  price?: number
  amenities?: string
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
