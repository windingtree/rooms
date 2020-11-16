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

import {
  getProfile,
  updateProfile,
} from './profile'

import {
  getHotel,
  updateHotel,
} from './hotel'

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

    getProfile,
    updateProfile,

    getHotel,
    updateHotel,
  }
}())

export { apiClient }
