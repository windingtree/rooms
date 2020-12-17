import { IProfileRole, IHttpStatus, IHttpStatusCodes } from '../../_lib/types'

interface IConstants {
  PROFILE_ROLE: IProfileRole
  HTTP_STATUS_CODES: IHttpStatusCodes
  HTTP_STATUS: IHttpStatus
  ONE_MONGO_CONNECTION_PER_REQUEST: boolean
}

export {
  IConstants,
}
