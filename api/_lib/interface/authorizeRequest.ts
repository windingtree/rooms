import { CONSTANTS } from '../common/constants'
import { CError } from '../common/tools'
import { IAuthorizeRules, IAuthorizeRulesRoles, IAuthorizeRequestAction, IProfileRole } from '../common/types'

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

  'room_type': {
    POST: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'room_type/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
    PATCH: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
    DELETE: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'room_types': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
  },

  'booking': {
    POST: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'booking/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
    PATCH: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
    DELETE: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'bookings': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
  },

  'orgid/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
  },

  'api_test/teardown': {
    POST: allowRoles(SUPER_ADMIN),
  },

  'rate_modifier': {
    POST: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'rate_modifier/{id}': {
    GET: allowRoles(SUPER_ADMIN, MANAGER, OWNER, OBSERVER),
    PATCH: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
    DELETE: allowRoles(SUPER_ADMIN, MANAGER, OWNER),
  },
  'rate_modifiers': {
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

export { authorizeRequest }
