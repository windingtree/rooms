import { ObjectID } from 'mongodb'

import { CONSTANTS } from '../../_lib/infra/constants'
import { CError } from '../../_lib/tools'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

function isFunction(functionToCheck: unknown): boolean {
  if (!functionToCheck) return false
  return {}.toString.call(functionToCheck) === '[object Function]'
}

function isObject(variableToCheck: unknown): boolean {
  return Object.prototype.toString.call(variableToCheck) === '[object Object]'
}

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

function getObjectIdString(objectId: ObjectID|string|undefined|null): string {
  if (typeof objectId === 'string') {
    return objectId
  } else if (typeof objectId === 'undefined' || objectId === null || !isFunction(objectId.toHexString)) {
    return ''
  }

  return objectId.toHexString()
}

export {
  isFunction,
  isObject,
  getObjectId,
  getObjectIdString,
}
