import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

import {
  apiCache,
} from '../../api_cache'

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
  return fetch(`/api/v1/bookings/${id}`, {
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
  apiCache.addBooking(data)

  return fetch('/api/v1/bookings', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((booking) => {
      apiCache.updateBooking(data.id, booking)

      return booking
    })
}

function updateBooking(data) {
  apiCache.updateBooking(data.id, data)

  return fetch('/api/v1/bookings/' + data.id, {
    method: 'PUT',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((booking) => {
      apiCache.updateBooking(data.id, booking)

      return booking
    })
}

function deleteBooking(id) {
  apiCache.deleteBooking(id)

  return fetch('/api/v1/bookings/' + id, {
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
