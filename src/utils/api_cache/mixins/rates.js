import { objClone } from '../../functions'

function getRateModifiers() {
  const _rates = []

  if (!this.cache.rateModifiers) {
    return []
  }

  this.cache.rateModifiers.forEach((rateModifier) => {
    _rates.push(objClone(rateModifier))
  })

  return _rates
}

function setRateModifiers(rateModifiers) {
  const _rateModifiers = []

  rateModifiers.forEach((rateModifier) => {
    _rateModifiers.push(objClone(rateModifier))
  })

  this.cache.rateModifiers = _rateModifiers

  this.saveCache()
}

function getRateModifier(rateModifierId) {
  let _rateModifier

  if (!this.cache.rateModifiers) {
    return null
  }

  _rateModifier = this.cache.rateModifiers.find((rateModifier) => {
    return rateModifier.id === rateModifierId
  })

  if (typeof _rateModifier === 'undefined') {
    return null
  }

  return objClone(_rateModifier)
}

function addRateModifier(rateModifier) {
  const _rateModifiers = []
  if (this.cache.rateModifiers) {
    this.cache.rateModifiers.forEach((rateModifier) => {
      _rateModifiers.push(objClone(rateModifier))
    })
  }

  _rateModifiers.push(rateModifier)

  this.cache.rateModifiers = _rateModifiers
  this.saveCache()
}

function updateRateModifier(rateModifierId, data) {
  const _rateModifiers = []

  if (!this.cache.rateModifiers) {
    return
  }

  this.cache.rateModifiers.forEach((rateModifier) => {
    if (rateModifier.id === rateModifierId) {
      _rateModifiers.push(Object.assign({}, objClone(rateModifier), objClone(data)))
    } else {
      _rateModifiers.push(objClone(rateModifier))
    }
  })

  this.cache.rateModifiers = _rateModifiers
  this.saveCache()
}

function deleteRateModifier(rateModifierId) {
  const _rateModifiers = []

  if (!this.cache.rateModifiers) {
    return
  }

  this.cache.rateModifiers.forEach((rateModifier) => {
    if (rateModifier.id === rateModifierId) {
      return
    }

    _rateModifiers.push(objClone(rateModifier))
  })

  this.cache.rateModifiers = _rateModifiers
  this.saveCache()
}

export {
  getRateModifiers,
  setRateModifiers,
  getRateModifier,
  addRateModifier,
  updateRateModifier,
  deleteRateModifier,
}
