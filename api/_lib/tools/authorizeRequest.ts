import { CError } from '../tools'
import { CONSTANTS } from '../infra/constants'
import { IAuthorizeRules, IAuthorizeRulesMethods } from '../types'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN
const MANAGER = CONSTANTS.PROFILE_ROLE.MANAGER
const OWNER = CONSTANTS.PROFILE_ROLE.OWNER
const OBSERVER = CONSTANTS.PROFILE_ROLE.OBSERVER

function allowRoles(...roles: Array<string>): IAuthorizeRulesMethods {
  const allowedRoles: IAuthorizeRulesMethods = {}

  roles.forEach((role) => {
    allowedRoles[role] = true
  })

  return allowedRoles
}

const AUTHORIZE_RULES: IAuthorizeRules = {
  'hotel': {
    POST: allowRoles(SUPER_ADMIN, MANAGER),
  },
  'hotel/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
    PATCH: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
    DELETE: allowRoles(SUPER_ADMIN),
  },
  'hotels': {
    GET: allowRoles(SUPER_ADMIN, MANAGER),
  },

  'profile': {
    POST: allowRoles(SUPER_ADMIN, MANAGER),
  },
  'profile/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
    PATCH: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
    DELETE: allowRoles(SUPER_ADMIN, MANAGER),
  },
  'profiles': {
    GET: allowRoles(SUPER_ADMIN, MANAGER),
  },
}

async function authorizeRequest(role: string, action: { method: string, route: string }): Promise<boolean> {
  if (
    typeof AUTHORIZE_RULES[action.route] !== 'undefined' &&
    typeof AUTHORIZE_RULES[action.route][action.method] !== 'undefined' &&
    typeof AUTHORIZE_RULES[action.route][action.method][role] !== 'undefined'
  ) {
    return true
  }

  throw new CError(
    403,
    `User with role '${role}' is not authorized to perform '${action.method}' on '${action.route}'.`
  )
}

export {
  authorizeRequest,
}
