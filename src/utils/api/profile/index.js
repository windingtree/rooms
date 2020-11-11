import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

import {
  ApiCache,
} from '../../api_cache'

const apiCache = ApiCache.getInstance()

function getProfile() {
  return fetch('/api/v1/profile', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
    .then((profile) => {
      apiCache.setProfile(profile)

      return profile
    })
}

function updateProfile(data) {
  apiCache.updateProfile(data)

  return fetch('/api/v1/profile', {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then((profile) => {
      apiCache.setProfile(profile)

      return profile
    })
}

export {
  getProfile,
  updateProfile,
}