function getProfile() {
  const _profile = JSON.parse(JSON.stringify(this.cache.profile))

  return _profile
}

function setProfile(profile) {
  const _profile = JSON.parse(JSON.stringify(profile))

  this.cache.profile = _profile

  this.saveCache()
}

export {
  getProfile,
  setProfile,
}
