import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'
/*

import {
  ApiCache,
} from '../../api_cache'

// const apiCache = ApiCache.getInstance()
*/

function getRateModifiers() {
  return fetch('/api/v1/rate_modifiers', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((rateModifiers) => {
        //TODO - add it to cache
      // apiCache.setRoomTypes(roomTypes)
      return rateModifiers
    })
}

function getRateModifier(id) {
  return fetch(`/api/v1/rate_modifier/${id}`, {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((record) => {
      // apiCache.updateRoomType(id, roomType)

      return record
    })
}
function createRateModifier(data) {
  return fetch('/api/v1/rate_modifier', {
    method: 'POST',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((record) => {
      // apiCache.addRoomType(roomType)
      return record
    })
}
function updateRateModifier(id, data) {
  //TODO
  // apiCache.updateRoomType(id, data)

  return fetch(`/api/v1/rate_modifier/${id}`, {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((rateModifier) => {
      // apiCache.updateRoomType(id, record)

      return rateModifier
    })
}

function deleteRateModifier(id) {
  //TODO - remove from cache
  // apiCache.deleteRoomType(id)

  return fetch(`/api/v1/rate_modifier/${id}`, {
    method: 'DELETE',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      // apiCache.deleteRoomType(id)

      return data
    })
}

export {
  getRateModifiers,
  getRateModifier,
  createRateModifier,
  updateRateModifier,
  deleteRateModifier,
}
