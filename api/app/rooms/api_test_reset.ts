import { getBookings, deleteBooking, getRoomTypes, deleteRoomType, createProfile, deleteProfile } from '../rooms'
import { CError, disableApiRequestsHere } from '../../tools'
import { IBookingCollection, IRoomTypeCollection, IProfileData } from '../../types'
import { API_TEST_EMAIL, API_TEST_ONE_TIME_PASSWORD, API_TEST_SESSION_TOKEN } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function apiTestReset(): Promise<IProfileData> {
  if (typeof API_TEST_EMAIL !== 'string' || API_TEST_EMAIL === '') {
    throw new CError(500, 'API_TEST_EMAIL environment variable is not set.')
  }
  const email: string = API_TEST_EMAIL
  let c1: number

  const bookings: IBookingCollection = await getBookings(email)
  for (c1 = 0; c1 < bookings.length; c1 += 1) {
    await deleteBooking(bookings[c1].id)
  }

  const roomTypes: IRoomTypeCollection = await getRoomTypes(email)
  for (c1 = 0; c1 < roomTypes.length; c1 += 1) {
    await deleteRoomType(roomTypes[c1].id)
  }

  try {
    await deleteProfile(email)
  } catch (err) {
    // Do nothing.
    // We need to make sure the test profile doesn't exist.
    // We are going to create a new test profile from scratch.
    // See below.
  }

  if (typeof API_TEST_ONE_TIME_PASSWORD !== 'string' || API_TEST_ONE_TIME_PASSWORD === '') {
    throw new CError(500, 'API_TEST_ONE_TIME_PASSWORD environment variable is not set.')
  }
  if (typeof API_TEST_SESSION_TOKEN !== 'string' || API_TEST_SESSION_TOKEN === '') {
    throw new CError(500, 'API_TEST_SESSION_TOKEN environment variable is not set.')
  }

  const oneTimePassword: string = API_TEST_ONE_TIME_PASSWORD
  const sessionToken: string = API_TEST_SESSION_TOKEN

  const profileData: IProfileData = await createProfile({email, oneTimePassword, sessionToken})

  return profileData
}

export {
  apiTestReset,
}
