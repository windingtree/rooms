import { ObjectID } from 'mongodb'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

function getObjectId(id: string|undefined|null): ObjectID|null {
  if (typeof id === 'undefined' || id === null || id === '') {
    return null
  }

  let objectId: ObjectID
  try {
    objectId = new ObjectID(id)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, 'Tried to convert an illegal value to ObjectID.', err)
  }

  return objectId
}

export { getObjectId }
