import { localStorageFallback } from '../storage_factory'
import { CONSTANTS } from '../constants'

const { LOCAL_STORAGE_JWT_TOKEN_KEY } = CONSTANTS

function checkStatus(response) {
  if (
    (typeof response.status !== 'number') ||
    (response.status < 200 || response.status >= 300)
  ) {
    const error = new Error(`HTTP Error ${response.statusText}`)

    error.status = response.statusText
    error.response = response

    if (
      ((error) && (error.status === 'Unauthorized')) ||
      ((error) && (error.response) && (
        error.response.status === 401 || error.response.status === 402 || error.response.status === 403
      ))
    ) {
      if (typeof window.__global_logout_method !== 'undefined') {
        window.__global_logout_method()
      }
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
