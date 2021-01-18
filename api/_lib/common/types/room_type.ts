import { ObjectID } from 'mongodb'

type TRoomTypeDbDataFields =
  | '_id'
  | 'hotelId'
  | 'type'
  | 'description'
  | 'quantity'
  | 'price'
  | 'devConPrice'
  | 'amenities'
  | 'imageUrl'

type IRoomTypeDbDataProjection = {
  [key in TRoomTypeDbDataFields]?: 1
}

interface IBaseRoomType {
  hotelId: string
  type: string
  description: string
  quantity: number
  price: number
  devConPrice: number
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
  devConPrice?: number
  amenities?: string
  imageUrl?: string
}

interface IPatchRoomTypePayload {
  hotelId?: string
  type?: string
  description?: string
  quantity?: number
  price?: number
  devConPrice?: number
  amenities?: string
  imageUrl?: string
}

interface IBaseRoomTypeDbData {
  hotelId: ObjectID|null
  type: string
  description: string
  quantity: number
  price: number
  devConPrice: number
  amenities: string
  imageUrl: string
}

interface IRoomTypeDbData extends IBaseRoomTypeDbData {
  _id: ObjectID|null
}

interface IPatchRoomTypePayloadDbData {
  hotelId?: ObjectID|null
  type?: string
  description?: string
  quantity?: number
  price?: number
  devConPrice?: number
  amenities?: string
  imageUrl?: string
}

type IRoomTypeCollectionDbData = Array<IRoomTypeDbData>

export {
  TRoomTypeDbDataFields,
  IRoomTypeDbDataProjection,
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
  IPostRoomTypePayload,
  IPatchRoomTypePayload,
  IBaseRoomTypeDbData,
  IRoomTypeDbData,
  IPatchRoomTypePayloadDbData,
  IRoomTypeCollectionDbData,
}
