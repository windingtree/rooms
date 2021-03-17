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
  uploadImages
} from './roomTypes'

import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingPrice
} from './bookings'

import {
  getProfile,
  updateProfile,
} from './profile'

import {
  getHotel,
  updateHotel,
} from './hotel'

import {
  getRateModifiers,
  getRateModifier,
  updateRateModifier,
  deleteRateModifier,
  createRateModifier
} from './rateModifiers'


const apiClient = (function () {
  return {
    login,
    emailOneTimePassword,

    getRoomTypes,
    getRoomType,
    createRoomType,
    updateRoomType,
    deleteRoomType,
    uploadImages,

    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingPrice,

    getProfile,
    updateProfile,

    getHotel,
    updateHotel,

    getRateModifiers,
    getRateModifier,
    updateRateModifier,
    deleteRateModifier,
    createRateModifier
  }
}())

export { apiClient }
