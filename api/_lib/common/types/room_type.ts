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

type IRoomTypeBeds = Array<number>

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
  beds: IRoomTypeBeds
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
  beds?: IRoomTypeBeds
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
  beds?: IRoomTypeBeds
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
  beds: IRoomTypeBeds
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
  beds?: IRoomTypeBeds
}

type IRoomTypeCollectionDbData = Array<IRoomTypeDbData>

export {
  TRoomTypeDbDataFields,
  IRoomTypeDbDataProjection,
  IRoomTypeBeds,
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
