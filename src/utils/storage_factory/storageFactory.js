/* ISC License (ISC). Copyright 2017 Michal Zalecki */

function storageFactory(getStorage) {
  let inMemoryStorage = {}

  function isSupported() {
    try {
      const testKey = '__random_key_2398473289432743284__'
      getStorage().setItem(testKey, testKey)
      getStorage().removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }

  function clear() {
    if (isSupported()) {
      getStorage().clear()
    } else {
      inMemoryStorage = {}
    }
  }

  function getItem(name) {
    if (isSupported()) {
      return getStorage().getItem(name)
    }
    if (inMemoryStorage.hasOwnProperty(name)) {
      return inMemoryStorage[name]
    }
    return null
  }

  function key(index) {
    if (isSupported()) {
      return getStorage().key(index)
    } else {
      return Object.keys(inMemoryStorage)[index] || null
    }
  }

  function removeItem(name) {
    if (isSupported()) {
      getStorage().removeItem(name)
    } else {
      delete inMemoryStorage[name]
    }
  }

  function setItem(name, value) {
    if (isSupported()) {
      getStorage().setItem(name, value)
    } else {
      inMemoryStorage[name] = String(value)
    }
  }

  function length() {
    if (isSupported()) {
      return getStorage().length
    } else {
      return Object.keys(inMemoryStorage).length
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    key,
    get length() {
      return length()
    },
  }
}

export {
  storageFactory,
}
