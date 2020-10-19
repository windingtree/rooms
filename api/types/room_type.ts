import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

interface IBaseRoomType {
  type: string
  quantity: number
  price: number
  amenities: string
}

interface IRoomType extends IBaseRoomType {
  id: string
}

type IRoomTypeCollection = Array<IRoomType>

export {
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
}
