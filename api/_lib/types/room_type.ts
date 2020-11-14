interface IBaseRoomType {
  type: string
  quantity: number
  price: number
  amenities: string
}

interface IRoomType extends IBaseRoomType {
  email: string
  id: string
}

type IRoomTypeCollection = Array<IRoomType>

export {
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
}
