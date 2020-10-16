function getRoomTypes() {
  const _roomTypes = []

  if (!this.cache.roomTypes) {
    return []
  }

  this.cache.roomTypes.forEach((roomType) => {
    _roomTypes.push(Object.assign({}, roomType))
  })

  return _roomTypes
}

function setRoomTypes(roomTypes) {
  const _roomTypes = []

  roomTypes.forEach((roomType) => {
    _roomTypes.push(Object.assign({}, roomType))
  })

  this.cache.roomTypes = _roomTypes

  this.saveCache()
}

function getRoomType(roomTypeId) {
  let _roomType

  if (!this.cache.roomTypes) {
    return null
  }

  _roomType = this.cache.roomTypes.find((roomType) => {
    return roomType.id === roomTypeId
  })

  if (typeof _roomType === 'undefined') {
    return null
  }

  return Object.assign({}, _roomType)
}

function addRoomType(roomType) {
  const _roomTypes = []

  if (this.cache.roomTypes) {
    this.cache.roomTypes.forEach((roomType) => {
      _roomTypes.push(Object.assign({}, roomType))
    })
  }

  _roomTypes.push(roomType)

  this.cache.roomTypes = _roomTypes
  this.saveCache()
}

function updateRoomType(roomTypeId, newRoomType) {
  const _roomTypes = []

  if (!this.cache.roomTypes) {
    return
  }

  this.cache.roomTypes.forEach((roomType) => {
    if (roomType.id === roomTypeId) {
      _roomTypes.push(Object.assign({}, newRoomType))
    } else {
      _roomTypes.push(Object.assign({}, roomType))
    }
  })

  this.cache.roomTypes = _roomTypes
  this.saveCache()
}

function deleteRoomType(roomTypeId) {
  const _roomTypes = []

  if (!this.cache.roomTypes) {
    return
  }

  this.cache.roomTypes.forEach((roomType) => {
    if (roomType.id === roomTypeId) {
      return
    }

    _roomTypes.push(Object.assign({}, roomType))
  })

  this.cache.roomTypes = _roomTypes
  this.saveCache()
}

export {
  getRoomTypes,
  setRoomTypes,
  getRoomType,
  addRoomType,
  updateRoomType,
  deleteRoomType,
}
