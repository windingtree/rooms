const apiClient = (function () {
  function getRooms(success) {
    return fetch('/api/v1/rooms', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbGVyYS5yb3p1dmFuQGdtYWlsLmNvbSIsIm9uZVRpbWVQYXNzd29yZCI6IjRjNGNhYzEyLTMxZDUtNDAwMi1hMjAyLTIzMTk0M2NiNjhiMyJ9.xTbyFnVvpxON5ZxUVr57Cp20DrN7QrWpqvfFkZ7KXg8'
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
  }

  function createRoom(data) {
    return fetch('/api/v1/rooms', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbGVyYS5yb3p1dmFuQGdtYWlsLmNvbSIsIm9uZVRpbWVQYXNzd29yZCI6IjRjNGNhYzEyLTMxZDUtNDAwMi1hMjAyLTIzMTk0M2NiNjhiMyJ9.xTbyFnVvpxON5ZxUVr57Cp20DrN7QrWpqvfFkZ7KXg8'
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }

  function updateRoom(data) {
    return fetch('/api/v1/rooms/' + data.id, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbGVyYS5yb3p1dmFuQGdtYWlsLmNvbSIsIm9uZVRpbWVQYXNzd29yZCI6IjRjNGNhYzEyLTMxZDUtNDAwMi1hMjAyLTIzMTk0M2NiNjhiMyJ9.xTbyFnVvpxON5ZxUVr57Cp20DrN7QrWpqvfFkZ7KXg8'
      },
    }).then(checkStatus);
  }

  function deleteRoom(data) {
    return fetch('/api/v1/rooms/' + data.id, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbGVyYS5yb3p1dmFuQGdtYWlsLmNvbSIsIm9uZVRpbWVQYXNzd29yZCI6IjRjNGNhYzEyLTMxZDUtNDAwMi1hMjAyLTIzMTk0M2NiNjhiMyJ9.xTbyFnVvpxON5ZxUVr57Cp20DrN7QrWpqvfFkZ7KXg8'
      },
    }).then(checkStatus);
  }

  function startRoom(data) {
    // return fetch('/api/timers/start', {
    //   method: 'post',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // }).then(checkStatus);
  }

  function stopRoom(data) {
    // return fetch('/api/timers/stop', {
    //   method: 'post',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // }).then(checkStatus);
  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  return {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    startRoom,
    stopRoom,
  };
}());

export { apiClient }
