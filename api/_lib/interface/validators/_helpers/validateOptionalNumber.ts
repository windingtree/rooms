// common imports
import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateOptionalNumber(propName: string, _value: unknown): Promise<number|undefined> {
  let value: number|undefined = undefined

  if (typeof _value === 'number') {
    value = _value
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a value of type 'number'.`)
  }

  return value
}

export { validateOptionalNumber }
