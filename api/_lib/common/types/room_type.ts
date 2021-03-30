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
  | 'guestsNumber'
  | 'childFriendly'
  | 'petFriendly'
  | 'beds'
  | 'images'

type IRoomTypeDbDataProjection = {
  [key in TRoomTypeDbDataFields]?: 1
}

type IRoomTypeBeds = Array<number>

type IRoomTypeImages = Array<string>

interface IBaseRoomType {
  hotelId: string
  type: string
  description: string
  quantity: number
  price: number
  currency: string
  devConPrice: number
  amenities: string
  guestsNumber: number
  childFriendly: boolean
  petFriendly: boolean
  beds: IRoomTypeBeds
  images: IRoomTypeImages
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
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: IRoomTypeBeds
  images?: IRoomTypeImages
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
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: IRoomTypeBeds
  images?: IRoomTypeImages
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
  guestsNumber: number
  childFriendly: boolean
  petFriendly: boolean
  beds: IRoomTypeBeds
  images: IRoomTypeImages
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
  guestsNumber?: number
  childFriendly?: boolean
  petFriendly?: boolean
  beds?: IRoomTypeBeds
  images?: IRoomTypeImages
}

type IRoomTypeCollectionDbData = Array<IRoomTypeDbData>

export {
  TRoomTypeDbDataFields,
  IRoomTypeDbDataProjection,
  IRoomTypeBeds,
  IRoomTypeImages,
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
