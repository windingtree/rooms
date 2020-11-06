import {
  checkStatus,
  makeAuthHeaders,
  parseJSON,
} from '../helpers'

function getProfile() {
  return fetch('/api/v1/profile', {
    method: 'GET',
    headers: makeAuthHeaders(),
  }).then(checkStatus)
    .then(parseJSON)
}

function updateProfile(data) {
  return fetch('/api/v1/profile', {
    method: 'PATCH',
    headers: makeAuthHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

export {
  getProfile,
  updateProfile,
}
