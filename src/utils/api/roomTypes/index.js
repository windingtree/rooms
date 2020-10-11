import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

function getRoomTypes() {
  return fetch('/api/v1/room_types', {
    method: 'get',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function getRoomType(id) {
  return fetch(`/api/v1/room_types/${id}`, {
    method: 'get',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function createRoomType(data) {
  return fetch('/api/v1/room_types', {
    method: 'post',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
}

function updateRoomType(data) {
  return fetch('/api/v1/room_types/' + data.id, {
    method: 'put',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

function deleteRoomType(id) {
  return fetch('/api/v1/room_types/' + id, {
    method: 'delete',
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
