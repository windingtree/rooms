import { checkRequiredAppConfigProps } from './checkRequiredAppConfigProps'
import { getBookings, deleteBooking, getRoomTypes, deleteRoomType } from '../../data/rooms_legacy'
import { deleteProfileByEmail } from '../../../_lib/data/profile'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import { IBookingCollection, IRoomTypeCollection, IProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const FORBIDDEN = CONSTANTS.HTTP_STATUS.FORBIDDEN

async function apiTestTearDown(requester: IProfile): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  checkRequiredAppConfigProps(appConfig)

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const bookings: IBookingCollection = await getBookings(requester.email)
  for (let c1 = 0; c1 < bookings.length; c1 += 1) {
    await deleteBooking(bookings[c1].id)
  }

  const roomTypes: IRoomTypeCollection = await getRoomTypes(requester.email)
  for (let c1 = 0; c1 < roomTypes.length; c1 += 1) {
    await deleteRoomType(roomTypes[c1].id)
  }

  await deleteProfileByEmail(requester.email)
}

export {
  apiTestTearDown,
}
