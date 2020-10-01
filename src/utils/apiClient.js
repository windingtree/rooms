const apiClient = (function () {
  function login(data) {
    return fetch('/api/v1/login', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }).then(checkStatus)
      .then(parseJSON)
  }

  function getRooms(success) {
    const jwtToken = window.localStorage.getItem('jwt_token')

    return fetch('/api/v1/rooms', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success)
  }

  function createRoom(data) {
    const jwtToken = window.localStorage.getItem('jwt_token')

    return fetch('/api/v1/rooms', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  function updateRoom(data) {
    const jwtToken = window.localStorage.getItem('jwt_token')

    return fetch('/api/v1/rooms/' + data.id, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    }).then(checkStatus)
  }

  function deleteRoom(data) {
    const jwtToken = window.localStorage.getItem('jwt_token')

    return fetch('/api/v1/rooms/' + data.id, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    }).then(checkStatus)
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
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}())

export { apiClient }
