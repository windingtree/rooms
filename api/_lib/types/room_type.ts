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

interface IRoomTypeDbRecord {
  _id: ObjectID
  hotelId: ObjectID
  type: string
  quantity: number
  price: number
  amenities: string
}

type IRoomTypeDbRecordCollection = Array<IRoomTypeDbRecord>

export {
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
  IPostRoomTypePayload,
  IPatchRoomTypePayload,
  IRoomTypeDbRecord,
  IRoomTypeDbRecordCollection,
}
