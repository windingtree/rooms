import {
  login,
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
