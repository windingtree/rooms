import { localStorageFallback } from '../storage_factory'
import { CONSTANTS } from '../constants'

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

import {
  getRateModifiers,
  setRateModifiers,
  getRateModifier,
  addRateModifier,
  updateRateModifier,
  deleteRateModifier,
} from './mixins/rates'

const { LOCAL_STORAGE_CACHE_KEY } = CONSTANTS

class CApiCache {
  constructor() {
    if (this.isStorageSupported(localStorage) === false) {
      console.error('Unfortunately, localStorage is not supported. Will use a fallback.')
    }
    this.cache = {}
    this.loadCache()
  }

  isStorageSupported = (storage) => {
    // NOTE for Firefox browser.
    //
    // Even though this function will return `true` in Firefox, sometimes
    // localStorage does not persist across tabs and/or browser restarts.
    //
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=1453699 issue.
    //
    // In that issue, a workaround is provided:
    //
    // Date: 2019-12-04 03:11 PST
    //
    // "We are still stabilizing LSNG (which solves this issue) such
    // that it is not on by default in releases (only in beta and nightly).
    // You can switch it on using the pref dom.storage.next_gen set to true."
    try {
      const key = '__random_key_2398473289432743284__'
      storage.setItem(key, key)
      storage.removeItem(key)
      return true
    } catch (err) {
      return false
    }
  }

  loadCache = () => {
    let _cache

    try {
      const _cacheStr = localStorageFallback.getItem(LOCAL_STORAGE_CACHE_KEY)
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
    localStorageFallback.setItem(LOCAL_STORAGE_CACHE_KEY, _cacheStr)
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

  getRateModifiers,
  setRateModifiers,
  getRateModifier,
  addRateModifier,
  updateRateModifier,
  deleteRateModifier,

})

export {
  CApiCache,
}
