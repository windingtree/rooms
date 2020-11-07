import { CApiCache } from './CApiCache'

function getInstance() {
  let apiCache

  if (typeof window.__apiCache__instance__ === 'undefined') {
    apiCache = new CApiCache()
    window.__apiCache__instance__ = apiCache
  } else {
    apiCache = window.__apiCache__instance__
  }

  return apiCache
}

const ApiCache = {
  getInstance
}

export {
  ApiCache,
}
