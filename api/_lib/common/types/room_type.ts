import { ObjectID } from 'mongodb'

type TRoomTypeDbDataFields =
  | '_id'
  | 'hotelId'
  | 'type'
  | 'description'
  | 'quantity'
  | 'price'
  | 'currency'
  | 'devConPrice'
  | 'amenities'
  | 'imageUrl'
  | 'guestsNumber'
  | 'childFriendly'
  | 'petFriendly'
  | 'beds'

type IRoomTypeDbDataProjection = {
  [key in TRoomTypeDbDataFields]?: 1
}

interface IBaseRoomType {
  hotelId: string
  type: string
  description: string
  quantity: number
  price: number
  currency: string
  devConPrice: number
  amenities: string
  imageUrl: string
  guestsNumber: number
  childFriendly: boolean
  petFriendly: boolean
  beds: any
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
  currency?: string
  devConPrice?: number
  amenities?: string
  imageUrl?: string
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: any
}

interface IPatchRoomTypePayload {
  hotelId?: string
  type?: string
  description?: string
  quantity?: number
  price?: number
  currency?: string
  devConPrice?: number
  amenities?: string
  imageUrl?: string
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: any
}

interface IBaseRoomTypeDbData {
  hotelId: ObjectID|null
  type: string
  description: string
  quantity: number
  price: number
  currency: string
  devConPrice: number
  amenities: string
  imageUrl: string
  guestsNumber: number
  childFriendly: boolean
  petFriendly: boolean
  beds: any
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
  currency?: string
  devConPrice?: number
  amenities?: string
  imageUrl?: string
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: any
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
