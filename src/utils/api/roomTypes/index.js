import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

import {
  ApiCache,
} from '../../api_cache'

const apiCache = ApiCache.getInstance()

function getRoomTypes() {
  return fetch('/api/v1/room_types', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((roomTypes) => {
      apiCache.setRoomTypes(roomTypes)

      return roomTypes
    })
}

function getRoomType(id) {
  return fetch(`/api/v1/room_type/${id}`, {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((roomType) => {
      apiCache.updateRoomType(id, roomType)

      return roomType
    })
}

function createRoomType(data) {
  return fetch('/api/v1/room_type', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((roomType) => {
      apiCache.addRoomType(data)

      return roomType
    })
}

function updateRoomType(id, data) {
  apiCache.updateRoomType(id, data)

  return fetch(`/api/v1/room_type/${id}`, {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((roomType) => {
      apiCache.updateRoomType(id, roomType)

      return roomType
    })
}

function deleteRoomType(id) {
  apiCache.deleteRoomType(id)

  return fetch(`/api/v1/room_type/${id}`, {
    method: 'DELETE',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      apiCache.deleteRoomType(id)

      return data
    })
}

export {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
}
