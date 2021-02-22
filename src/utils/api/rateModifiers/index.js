import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'
import {
  ApiCache,
} from '../../api_cache'


export const CRITERIA_TYPE_DATERANGE = 'DATE_RANGE';
export const CRITERIA_TYPE_DAYOFWEEK = 'DAYOFWEEK';
export const CRITERIA_TYPE_LENGTH_OF_STAY = 'LENGTH_OF_STAY';

export const TYPE_ABSOLUTE = 'absolute';
export const TYPE_PERCENTAGE = 'percentage';

const apiCache = ApiCache.getInstance()

function getRateModifiers() {
  return fetch('/api/v1/rate_modifiers', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((rateModifiers) => {
      apiCache.setRateModifiers(rateModifiers)
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
      apiCache.updateRateModifier(id, record)

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
      apiCache.addRateModifier(record)
      return record
    })
}
function updateRateModifier(id, data) {
  apiCache.updateRateModifier(id, data)

  return fetch(`/api/v1/rate_modifier/${id}`, {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((rateModifier) => {
      apiCache.updateRateModifier(id, rateModifier)
      return rateModifier
    })
}

function deleteRateModifier(id) {
  apiCache.updateRateModifier(id)

  return fetch(`/api/v1/rate_modifier/${id}`, {
    method: 'DELETE',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      apiCache.updateRateModifier(id)

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
