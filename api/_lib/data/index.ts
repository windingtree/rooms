export {
  createHotel,
  readHotel,
  readHotelByOwnerId,
  readHotels,
  readHotelsByOwnerId,
  updateHotel,
  updateHotelByOwnerId,
  deleteHotel,
  deleteHotelByOwnerId,
} from './hotel'

export {
  createProfile,
  readProfile,
  readProfileByEmail,
  readProfiles,
  updateProfile,
  deleteProfile,
} from './profile'

export {
  createRoomType,
  getRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypes,
  getAllRoomTypes,

  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookings,

  getOneTimePassword,

  pingDatabase,

  apiTestReset,
} from './rooms_legacy'
