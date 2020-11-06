import {
  checkStatus,
  makeHeaders,
  parseJSON,
} from '../helpers'

function login(data) {
  return fetch('/api/v1/login', {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

function emailOneTimePassword(data) {
  return fetch('/api/v1/send_one_time_pass', {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)}

export {
  login,
  emailOneTimePassword,
}
