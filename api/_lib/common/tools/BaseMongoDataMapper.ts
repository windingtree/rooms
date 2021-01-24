import { ObjectID } from 'mongodb'
import * as moment from 'moment'

import { getObjectId, getObjectIdString } from '../../common/tools'

class BaseMongoDataMapper {
  fromObjectId(objectId: ObjectID|null): string {
    return getObjectIdString(objectId)
  }

  toObjectId(id: string): ObjectID|null {
    return getObjectId(id)
  }

  toObjectIdArray(ids: Array<string>): Array<ObjectID> {
    const objIds: Array<ObjectID> = []

    ids.forEach((id: string) => {
      const objId: ObjectID|null = this.toObjectId(id)

      if (objId) {
        objIds.push(objId)
      }
    })

    return objIds
  }

  fromObjectIdArray(objIds: Array<ObjectID>): Array<string> {
    return objIds.map((objId: ObjectID) => {
      return this.fromObjectId(objId)
    })
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

export { BaseMongoDataMapper }
