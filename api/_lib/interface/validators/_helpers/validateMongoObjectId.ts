// node/npm imports
import { ObjectId } from 'mongodb'

// common imports
import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'

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
      throw new Error()
    }
  } catch (err: unknown) {
    throw new CError(
      BAD_REQUEST,
      `Property '${propName}' is not a valid Mongo ObjectID value.`,
      err
    )
  }
}

export { validateMongoObjectId }
