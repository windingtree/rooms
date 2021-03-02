import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IRoomTypeBeds } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateOptionalBedsArray(propName: string, _value: unknown): Promise<IRoomTypeBeds|undefined> {
  let value: IRoomTypeBeds|undefined = undefined

  if (Array.isArray(_value)) {
    _value.forEach((el) => {
      if (typeof el !== 'number') {
        throw new CError(BAD_REQUEST, `If provided, property '${propName}' should be an array containing 'numbers'.`)
      }
    })

    value = _value
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a value of type 'array'.`)
  }

  return value
}

export { validateOptionalBedsArray }
