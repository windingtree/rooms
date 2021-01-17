// common imports
import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

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

export { validateRequiredString }
