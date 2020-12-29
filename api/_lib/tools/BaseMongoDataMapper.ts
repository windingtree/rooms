import { ObjectID } from 'mongodb'

import {
  getObjectId,
  getObjectIdString,
} from '../../_lib/tools'

class BaseMongoDataMapper {
  fromObjectId(objectId: ObjectID|null): string {
    return getObjectIdString(objectId)
  }

  toObjectId(id: string): ObjectID|null {
    return getObjectId(id)
  }
}

export {
  BaseMongoDataMapper,
}
