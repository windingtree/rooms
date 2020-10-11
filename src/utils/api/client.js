import {
  login,
  emailOneTimePassword,
} from './auth'

import {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from './roomTypes'

import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from './bookings'

const apiClient = (function () {
  return {
    login,
    emailOneTimePassword,

    getRoomTypes,
    getRoomType,
    createRoomType,
    updateRoomType,
    deleteRoomType,

    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
  }
}())

export { apiClient }
