import { objClone } from '../../functions'

function getProfile() {
  const _profile = objClone(this.cache.profile)

  return _profile
}

function setProfile(profile) {
  const _profile = objClone(profile)

  this.cache.profile = _profile

  this.saveCache()
}

function updateProfile(data) {
  const property = data.property
  const value = data.value

  const _profile = objClone(this.cache.profile)

  _profile[property] = value

  this.cache.profile = _profile

  this.saveCache()
}

export {
  getProfile,
  setProfile,
  updateProfile,
}
