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
  const _profile = Object.assign({}, objClone(this.cache.profile), objClone(data))

  this.cache.profile = _profile

  this.saveCache()
}

export {
  getProfile,
  setProfile,
  updateProfile,
}
