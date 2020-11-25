import { objClone } from '../../functions'

function getHotel() {
  const _hotel = objClone(this.cache.hotel)

  return _hotel
}

function setHotel(hotel) {
  const _hotel = objClone(hotel)

  this.cache.hotel = _hotel

  this.saveCache()
}

function updateHotel(data) {
  const _hotel = Object.assign({}, objClone(this.cache.hotel), objClone(data))

  this.cache.hotel = _hotel

  this.saveCache()
}

export {
  getHotel,
  setHotel,
  updateHotel,
}
