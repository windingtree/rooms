import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateRequiredString(propName: string, _value: unknown): Promise<string> {
  let value: string

  if (typeof _value === 'string') {
    value = _value
  } else {
    throw new CError(BAD_REQUEST, `Property '${propName}' is required. It must have a value of type 'string'.`)
  }

  return value
}

export {
  validateRequiredString,
}
