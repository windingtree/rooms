import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

function getBookings() {
  return fetch('/api/v1/bookings', {
    method: 'get',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function getBooking(id) {
  return fetch(`/api/v1/bookings/${id}`, {
    method: 'get',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function createBooking(data) {
  return fetch('/api/v1/bookings', {
    method: 'post',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
}

function updateBooking(data) {
  return fetch('/api/v1/bookings/' + data.id, {
    method: 'put',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

function deleteBooking(id) {
  return fetch('/api/v1/bookings/' + id, {
    method: 'delete',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

export {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
}
