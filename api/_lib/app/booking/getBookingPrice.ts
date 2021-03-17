import { HotelRepo } from '../../data/hotel/HotelRepo'
import { calculateOfferPrice } from '../../app/rate_modifier'

import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { IHotel, IRoomType, IProfile, IGetBookingPricePayload, IBookingPrice } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const roomTypeRepo = new RoomTypeRepo()

async function getBookingPrice(requester: IProfile, data: IGetBookingPricePayload): Promise<IBookingPrice> {
  let hotel: IHotel

  if (requester.role === SUPER_ADMIN) {
    hotel = await hotelRepo.readHotel(data.hotelId)
  } else {
    hotel = await hotelRepo.readHotelByOwnerId(data.hotelId, requester.id)
  }

  let roomType: IRoomType

  if (requester.role === SUPER_ADMIN) {
    roomType = await roomTypeRepo.readRoomType(data.roomTypeId)
  } else {
    roomType = await roomTypeRepo.readRoomTypeByHotelId(data.roomTypeId, requester.hotelId)
  }

  const price = await calculateOfferPrice(hotel, roomType, data.arrival, data.departure, roomType.price)
  //FIXME: hardcoded currency code, to be changed
  return { price: price, currency: 'USD' }
}

export { getBookingPrice }
