import { objClone } from '../../functions'

function getBookings() {
  const _bookings = []

  if (!this.cache.bookings) {
    return []
  }

  this.cache.bookings.forEach((booking) => {
    _bookings.push(objClone(booking))
  })

  return _bookings
}

function setBookings(bookings) {
  const _bookings = []

  bookings.forEach((booking) => {
    _bookings.push(objClone(booking))
  })

  this.cache.bookings = _bookings

  this.saveCache()
}

function getBooking(bookingId) {
  let _booking

  if (!this.cache.bookings) {
    return null
  }

  _booking = this.cache.bookings.find((booking) => {
    return booking.id === bookingId
  })

  if (typeof _booking === 'undefined') {
    return null
  }

  return objClone(_booking)
}

function addBooking(booking) {
  const _bookings = []

  if (this.cache.bookings) {
    this.cache.bookings.forEach((booking) => {
      _bookings.push(objClone(booking))
    })
  }

  _bookings.push(booking)

  this.cache.bookings = _bookings
  this.saveCache()
}

function updateBooking(bookingId, data) {
  const _bookings = []

  if (!this.cache.bookings) {
    return
  }

  this.cache.bookings.forEach((booking) => {
    if (booking.id === bookingId) {
      _bookings.push(Object.assign({}, objClone(booking), objClone(data)))
    } else {
      _bookings.push(objClone(booking))
    }
  })

  this.cache.bookings = _bookings
  this.saveCache()
}

function deleteBooking(bookingId) {
  const _bookings = []

  if (!this.cache.bookings) {
    return
  }

  this.cache.bookings.forEach((booking) => {
    if (booking.id === bookingId) {
      return
    }

    _bookings.push(objClone(booking))
  })

  this.cache.bookings = _bookings
  this.saveCache()
}

export {
  getBookings,
  setBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
}
