import { CError, disableApiRequestsHere } from '../tools'
import { IProfileAuth } from '../types'
import { USER_ROLE } from '../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function check(allowedRoles: Array<string>, role: string): boolean {
  if (allowedRoles.includes(role)) {
    return true
  }

  return false
}

async function authorizeUser(
  profileAuth: IProfileAuth, method: string, action: string
): Promise<boolean> {
  const role = profileAuth.role

  const SUPER_ADMIN = USER_ROLE.SUPER_ADMIN
  const ADMIN = USER_ROLE.ADMIN
  const OBSERVER = USER_ROLE.OBSERVER

  switch (action) {
    case 'hotel':
      switch (method) {
        case 'POST':
          if (check([SUPER_ADMIN, ADMIN], role)) {
            return true
          }
          break
        case 'GET':
          if (check([SUPER_ADMIN, ADMIN, OBSERVER], role)) {
            return true
          }
          break
        case 'PATCH':
          if (check([SUPER_ADMIN, ADMIN], role)) {
            return true
          }
          break
        case 'DELETE':
          if (check([SUPER_ADMIN], role)) {
            return true
          }
          break
        default:
          break
      }
      break
    default:
      break
  }

  throw new CError(403, `User ${profileAuth.email} is not authorized to perform ${method} on ${action}.`)
}

export {
  authorizeUser,
}
