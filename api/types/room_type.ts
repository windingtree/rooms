interface IRoomType {
  id: string
  quantity: number
  type: string
  price: number
  amenities: string
}

type IRoomTypeCollection = Array<IRoomType>

export {
  IRoomType,
  IRoomTypeCollection
}
