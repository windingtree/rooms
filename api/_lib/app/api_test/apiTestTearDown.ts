import { AppConfig } from '../../app/config'

import { BookingRepo } from '../../data/booking/BookingRepo'
import { ProfileRepo } from '../../data/profile/ProfileRepo'
import { RoomTypeRepo } from '../../data/room_type/RoomTypeRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IRoomTypeCollection, IProfile, IBookingCollection, IStatus } from '../../common/types'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

const bookingRepo = new BookingRepo()
const profileRepo = new ProfileRepo()
const roomTypeRepo = new RoomTypeRepo()

async function apiTestTearDown(requester: IProfile): Promise<IStatus> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'true') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  if (typeof requester.hotelId === 'string' && requester.hotelId.length > 0) {
    const bookingCollection: IBookingCollection = await bookingRepo.readBookingsByHotelId(requester.hotelId)
    for (let c1 = 0; c1 < bookingCollection.length; c1 += 1) {
      await bookingRepo.deleteBooking(bookingCollection[c1].id)
    }

    const roomTypeCollection: IRoomTypeCollection = await roomTypeRepo.readRoomTypesByHotelId(requester.hotelId)
    for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
      await roomTypeRepo.deleteRoomType(roomTypeCollection[c1].id)
    }
  }

  await profileRepo.deleteProfile(requester.id)

  return { status: 'OK' }
}

export { apiTestTearDown }
