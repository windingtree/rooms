import {
  checkStatus,
  makeHeaders,
  parseJSON,
} from '../helpers'

function login(data) {
  return fetch('/api/v1/login', {
    method: 'post',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
}

function emailOneTimePassword(data) {
  return fetch('/api/v1/send_one_time_pass', {
    method: 'post',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)}

export {
  login,
  emailOneTimePassword,
}
