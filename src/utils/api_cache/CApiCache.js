import {
  getBookings,
  setBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} from './mixins/bookings'

import {
  getRoomTypes,
  setRoomTypes,
  getRoomType,
  addRoomType,
  updateRoomType,
  deleteRoomType,
} from './mixins/roomTypes'

import {
  getProfile,
  setProfile,
  updateProfile,
} from './mixins/profile'

import {
  getHotel,
  setHotel,
  updateHotel,
} from './mixins/hotel'

const LOCAL_STORAGE_CACHE_KEY = 'api_cache'

class CApiCache {
  constructor() {
    this.cache = {}
    this.loadCache()
  }

  loadCache = () => {
    let _cache

    try {
      const _cacheStr = window.localStorage.getItem(LOCAL_STORAGE_CACHE_KEY)
      _cache = JSON.parse(_cacheStr)
    } catch (err) {
      this.clearCache()
      return
    }

    if ((_cache !== null) && (typeof _cache === 'object')) {
      this.cache = _cache
    } else {
      this.clearCache()
    }
  }

  saveCache = () => {
    const _cacheStr = JSON.stringify(this.cache)
    window.localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, _cacheStr)
  }

  clearCache = () => {
    this.cache = {
      bookings: [],
      roomTypes: [],
      profile: {},
      hotel: {},
    }

    this.saveCache()
  }
}

Object.assign(CApiCache.prototype, {
  getBookings,
  setBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,

  getRoomTypes,
  setRoomTypes,
  getRoomType,
  addRoomType,
  updateRoomType,
  deleteRoomType,

  getProfile,
  setProfile,
  updateProfile,

  getHotel,
  setHotel,
  updateHotel,
})

export {
  CApiCache,
}
