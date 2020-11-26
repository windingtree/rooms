import { checkRequiredAppConfigProps } from './checkRequiredAppConfigProps'
import { readBookingsByHotelId, deleteBooking } from '../../../_lib/data/booking'
import { profileMapper, deleteProfile, readProfileByEmail } from '../../../_lib/data/profile'
import {
  roomTypeCollectionMapper,
  readRoomTypes,
  deleteRoomType,
} from '../././../../_lib/data/room_type'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import {
  IRoomTypeCollection,
  IRoomTypeDbRecordCollection,
  IProfile,
  IProfileDbRecord,
  IBookingCollection,
} from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const FORBIDDEN = CONSTANTS.HTTP_STATUS.FORBIDDEN

async function apiTestTearDown(requester: IProfile): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  checkRequiredAppConfigProps(appConfig)

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const profileDbRecord: IProfileDbRecord = await readProfileByEmail(appConfig.API_TEST_EMAIL)
  const profile: IProfile = profileMapper(profileDbRecord)

  const bookings: IBookingCollection = await readBookingsByHotelId(profile.hotelId)
  for (let c1 = 0; c1 < bookings.length; c1 += 1) {
    await deleteBooking(bookings[c1].id)
  }

  const roomTypeDbRecordCollection: IRoomTypeDbRecordCollection = await readRoomTypes()
  const roomTypeCollection: IRoomTypeCollection = roomTypeCollectionMapper(roomTypeDbRecordCollection)
  for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
    await deleteRoomType(roomTypeCollection[c1].id)
  }

  await deleteProfile(profile.id)
}

export {
  apiTestTearDown,
}
