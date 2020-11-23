interface IBaseRoomType {
  ownerId: string
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
  ownerId: string
  hotelId: string
  type: string
  quantity?: number
  price?: number
  amenities?: string
}

interface IPatchRoomTypePayload {
  ownerId?: string
  hotelId?: string
  type?: string
  quantity?: number
  price?: number
  amenities?: string
}

interface IRoomTypeDbRecord extends IBaseRoomType {
  _id: string
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
