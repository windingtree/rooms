import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateOptionalString(propName: string, _value: unknown): Promise<string|undefined> {
  let value: string|undefined = undefined

  if (typeof _value === 'string') {
    value = _value
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a value of type 'string'.`)
  }

  return value
}

export { validateOptionalString }
