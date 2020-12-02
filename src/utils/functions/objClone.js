import { isFunction } from './isFunction'

function objClone(_obj) {
  if (_obj === null) {
    return null
  } else if (typeof _obj === 'undefined') {
    return undefined
  } else if (typeof _obj === 'string') {
    return (String(_obj)).valueOf()
  } else if (typeof _obj === 'number') {
    return (Number(_obj)).valueOf()
  } else if (isFunction(_obj)) {
    throw new Error('Error! The objClone() function can not be used to clone a Function.')
  }

  return JSON.parse(JSON.stringify(_obj))
}

export {
  objClone,
}
