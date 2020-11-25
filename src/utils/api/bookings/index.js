import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

import {
  ApiCache,
} from '../../api_cache'

const apiCache = ApiCache.getInstance()

function getBookings() {
  return fetch('/api/v1/bookings', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((bookings) => {
      apiCache.setBookings(bookings)

      return bookings
    })
}

function getBooking(id) {
  return fetch(`/api/v1/booking/${id}`, {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((booking) => {
      apiCache.updateBooking(id, booking)

      return booking
    })
}

function createBooking(data) {
  // apiCache.addBooking(data)

  return fetch('/api/v1/booking', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((booking) => {
      // apiCache.updateBooking(data.id, booking)
      apiCache.addBooking(booking)

      return booking
    })
}

function updateBooking(id, data) {
  apiCache.updateBooking(id, data)

  return fetch(`/api/v1/booking/${id}`, {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((booking) => {
      apiCache.updateBooking(id, booking)

      return booking
    })
}

function deleteBooking(id) {
  apiCache.deleteBooking(id)

  return fetch(`/api/v1/booking/${id}`, {
    method: 'DELETE',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      apiCache.deleteBooking(id)

      return data
    })
}

export {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
}
