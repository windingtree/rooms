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

const LOCAL_STORAGE_CACHE_KEY = 'api_cache'

class ApiCache {
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

    this.cache = _cache
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
    }

    this.saveCache()
  }
}

Object.assign(ApiCache.prototype, {
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
})

let apiCache
if (typeof window.__apiCache__instance__ === 'undefined') {
  apiCache = new ApiCache()
  window.__apiCache__instance__ = apiCache
} else {
  apiCache = window.__apiCache__instance__
}

export {
  apiCache,
}
