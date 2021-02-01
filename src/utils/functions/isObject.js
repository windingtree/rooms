function isObject(variableToCheck) {
  return Object.prototype.toString.call(variableToCheck) === '[object Object]'
}

export {
  isObject,
}
