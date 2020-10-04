interface IRoomType {
  id: string
  quantity: number
  type: string
  price: number
}

type IRoomTypeCollection = Array<IRoomType>

export {
  IRoomType,
  IRoomTypeCollection
}
