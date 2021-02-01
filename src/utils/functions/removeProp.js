import { isObject } from './isObject'

function removeProp(_obj, ...prop) {
  const props = [...prop]

  if (!isObject(_obj)) {
    throw new Error('The function removeProp() expects 1st argument to be of type "object".')
  }

  props.forEach((prop) => {
    if (typeof prop !== 'string') {
      throw new Error('The function removeProp() expects 2nd, 3rd, ..., arguments to be of type "string".')
    }
  })

  return Object.keys(_obj).reduce((object, key) => {
    if (!props.includes(key)) {
      object[key] = _obj[key]
    }
    return object
  }, {})
}

export {
  removeProp,
}
