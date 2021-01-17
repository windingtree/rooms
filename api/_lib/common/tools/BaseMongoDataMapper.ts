// node/npm imports
import { ObjectID } from 'mongodb'
import * as moment from 'moment'

// common imports
import { getObjectId, getObjectIdString } from '../../common/tools'

class BaseMongoDataMapper {
  fromObjectId(objectId: ObjectID|null): string {
    return getObjectIdString(objectId)
  }

  toObjectId(id: string): ObjectID|null {
    return getObjectId(id)
  }

  fromDate(date: Date|null): string {
    if (!moment.utc(date).isValid()) return ''

    return moment.utc(date).format()
  }

  toDate(date: string): Date|null {
    if (!moment.utc(date).isValid()) return null

    return moment.utc(date).toDate()
  }
}

export {
  BaseMongoDataMapper,
}
