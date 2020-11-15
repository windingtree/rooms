import { CError } from '../../tools'

async function validateRequiredString(propName: string, _value: unknown): Promise<string> {
  let value: string

  if (typeof _value === 'string') {
    value = _value
  } else {
    throw new CError(500, `Property '${propName}' is required, and must have a value of type 'string'.`)
  }

  return value
}

export {
  validateRequiredString,
}
