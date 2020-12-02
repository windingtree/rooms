import { localStorageFallback } from '../storage_factory'
import { CONSTANTS } from '../constants'
import { isFunction } from '../functions'

const { LOCAL_STORAGE_JWT_TOKEN_KEY } = CONSTANTS

function logout() {
  if (isFunction(window.__global_logout_method)) {
    window.__global_logout_method()
  }
}

function checkStatus(response) {
  if (
    (typeof response.status !== 'number') ||
    (response.status < 200 || response.status >= 300)
  ) {
    const error = new Error(`HTTP Error ${response.statusText}`)

    error.status = response.statusText
    error.response = response

    if (
      ((typeof error.status === 'string') && (error.status.toLowerCase() === 'unauthorized')) ||
      ((error.response) && (error.response.status === 401 || error.response.status === 403))
    ) {
      logout()
    }

    throw error
  }

  return response
}

function makeHeaders() {
  const headers = {}

  headers['Content-Type'] = 'application/json'
  headers['Accept'] = 'application/json'

  return headers
}

function makeAuthHeaders() {
  const headers = makeHeaders()
  const jwtToken = localStorageFallback.getItem(LOCAL_STORAGE_JWT_TOKEN_KEY)

  headers['Authorization'] = `Bearer ${jwtToken}`

  return headers
}

function parseJSON(response) {
  return response.json()
}

export {
  checkStatus,
  makeHeaders,
  makeAuthHeaders,
  parseJSON,
}
