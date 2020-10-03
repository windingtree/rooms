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

const apiClient = (function () {
  function login(data) {
    return fetch('/api/v1/login', {
      method: 'post',
      body: JSON.stringify(data),
      headers: makeHeaders(),
    }).then(checkStatus)
      .then(parseJSON)
  }

  function getRoomTypes() {
    return fetch('/api/v1/rooms', {
      method: 'get',
      headers: makeAuthHeaders(),
    }).then(checkStatus)
      .then(parseJSON)
  }

  function createRoomType(data) {
    return fetch('/api/v1/rooms', {
      method: 'post',
      body: JSON.stringify(data),
      headers: makeAuthHeaders(),
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  function updateRoomType(data) {
    return fetch('/api/v1/rooms/' + data.roomId, {
      method: 'put',
      body: JSON.stringify(data),
      headers: makeAuthHeaders(),
    }).then(checkStatus)
      .then(parseJSON)
  }

  function deleteRoomType(data) {
    return fetch('/api/v1/rooms/' + data.roomId, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: makeAuthHeaders(),
    }).then(checkStatus)
      .then(parseJSON)
  }

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

  function parseJSON(response) {
    return response.json()
  }

  return {
    login,
    getRoomTypes,
    createRoomType,
    updateRoomType,
    deleteRoomType,
  }
}())

export { apiClient }
