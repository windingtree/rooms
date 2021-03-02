import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateOptionalBoolean(propName: string, _value: unknown): Promise<boolean|undefined> {
  let value: boolean|undefined = undefined

  if (typeof _value === 'boolean') {
    value = _value
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a value of type 'boolean'.`)
  }

  return value
}

export { validateOptionalBoolean }
