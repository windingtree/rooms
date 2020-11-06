import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

import {
  apiCache,
} from '../../api_cache'

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
  return fetch(`/api/v1/room_types/${id}`, {
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
  apiCache.addRoomType(data)

  return fetch('/api/v1/room_types', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((roomType) => {
      apiCache.addRoomType(roomType)

      return roomType
    })
}

function updateRoomType(data) {
  apiCache.updateRoomType(data.id, data)

  return fetch('/api/v1/room_types/' + data.id, {
    method: 'PUT',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((roomType) => {
      apiCache.updateRoomType(data.id, roomType)

      return roomType
    })
}

function deleteRoomType(id) {
  apiCache.deleteRoomType(id)

  return fetch('/api/v1/room_types/' + id, {
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
