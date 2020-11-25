import { ObjectId } from 'mongodb'

import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function validateMongoObjectId(propName: string, _value: unknown): Promise<void> {
  if (typeof _value !== 'undefined' && typeof _value !== 'string') {
    throw new CError(
      BAD_REQUEST,
      `Property '${propName}' should be of type 'string'.`
    )
  } else if (typeof _value === 'undefined') {
    return
  }

  try {
    const objectId: ObjectId = new ObjectId(_value as string)
    const id: string = objectId.toHexString()

    if (id !== _value) {
      console.log(`propName = ${propName}`)
      console.log(`_value = ${_value}`)
      console.log(`id = ${id}`)

      throw new Error()
    }
  } catch (err) {
    throw new CError(
      BAD_REQUEST,
      `Property '${propName}' is not a valid Mongo ObjectID value.`
    )
  }
}

export {
  validateMongoObjectId,
}
