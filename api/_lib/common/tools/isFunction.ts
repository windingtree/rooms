function isFunction(functionToCheck: unknown): boolean {
  if (!functionToCheck) return false
  return {}.toString.call(functionToCheck) === '[object Function]'
}

export { isFunction }
