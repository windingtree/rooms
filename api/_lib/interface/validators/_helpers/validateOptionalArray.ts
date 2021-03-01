import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

export async function validateOptionalArray(propName: string, _value: unknown): Promise<any|undefined> {
  let value: any|undefined = undefined

  if (Array.isArray(_value)) {
    value = _value
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a value of type 'boolean'.`)
  }

  return value
}
