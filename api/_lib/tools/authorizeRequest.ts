import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IAuthorizeRules, IAuthorizeRulesRoles, IAuthorizeRequestAction, IProfileRole } from '../../_lib/types'

const { SUPER_ADMIN, MANAGER, OWNER, OBSERVER } = CONSTANTS.PROFILE_ROLE
const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

function allowRoles(...roles: Array<keyof IProfileRole>): IAuthorizeRulesRoles {
  const allowedRoles: IAuthorizeRulesRoles = {}

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

  'orgid/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
  },
}

async function authorizeRequest(role: keyof IProfileRole, action: IAuthorizeRequestAction): Promise<boolean> {
  if (
    typeof AUTHORIZE_RULES[action.route] !== 'undefined' &&
    typeof AUTHORIZE_RULES[action.route][action.method] !== 'undefined' &&
    typeof AUTHORIZE_RULES[action.route][action.method][role] !== 'undefined'
  ) {
    return true
  }

  throw new CError(
    UNAUTHORIZED,
    `User with role '${role}' is not authorized to perform '${action.method}' on '${action.route}'.`
  )
}

export {
  authorizeRequest,
}
