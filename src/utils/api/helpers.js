function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`)

    error.status = response.statusText
    error.response = response

    throw error
  }
}

function makeHeaders() {
  const headers = {}

  headers['Content-Type'] = 'application/json'
  headers['Accept'] = 'application/json'

  return headers
}

function makeAuthHeaders() {
  const headers = makeHeaders()
  const jwtToken = window.localStorage.getItem('jwt_token')

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
