function isObject(variableToCheck: unknown): boolean {
  return Object.prototype.toString.call(variableToCheck) === '[object Object]'
}

export { isObject }
