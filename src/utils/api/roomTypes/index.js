import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

function getRoomTypes() {
  return fetch('/api/v1/room_types', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function getRoomType(id) {
  return fetch(`/api/v1/room_types/${id}`, {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function createRoomType(data) {
  return fetch('/api/v1/room_types', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
}

function updateRoomType(data) {
  return fetch('/api/v1/room_types/' + data.id, {
    method: 'PUT',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

function deleteRoomType(id) {
  return fetch('/api/v1/room_types/' + id, {
    method: 'DELETE',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

export {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
}
