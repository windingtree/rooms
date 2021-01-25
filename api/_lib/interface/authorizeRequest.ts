import { CONSTANTS } from '../common/constants'
import { CError } from '../common/tools'
import { IAuthorizeRules, IAuthorizeRulesRoles, IAuthorizeRequestAction, IProfileRole } from '../common/types'

const { SUPER_ADMIN, SUPPORT_SUPERVISOR, SUPPORT_AGENT, OWNER, MANAGER, CLERK } = CONSTANTS.PROFILE_ROLE
const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

function allowRoles(...roles: Array<keyof IProfileRole>): IAuthorizeRulesRoles {
  const allowedRoles: IAuthorizeRulesRoles = {}

  roles.forEach((role) => {
    allowedRoles[role] = true
  })

  return allowedRoles
}

const ALL_ROLES = allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, SUPPORT_AGENT, OWNER, MANAGER, CLERK)

// TODO: Revisit the below role rules when all business requirements are in place.
//       I.e. what user role can access what route. Complete list, fine grained control.
const AUTHORIZE_RULES: IAuthorizeRules = {
  'hotel': {
    POST: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER),
  },
  'hotel/{id}': {
    GET: ALL_ROLES,
    PATCH: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER),
    DELETE: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER),
  },
  'hotels': {
    GET: ALL_ROLES,
  },

  'profile': {
    POST: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, SUPPORT_AGENT, OWNER),
  },
  'profile/{id}': {
    GET: ALL_ROLES,
    PATCH: ALL_ROLES,
    DELETE: ALL_ROLES,
  },
  'profiles': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, SUPPORT_AGENT, OWNER),
  },

  'room_type': {
    POST: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER),
  },
  'room_type/{id}': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
    PATCH: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER),
    DELETE: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER),
  },
  'room_types': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER),
  },

  'booking': {
    POST: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
  },
  'booking/{id}': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
    PATCH: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
    DELETE: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
  },
  'bookings': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
  },

  'orgid/{id}': {
    GET: allowRoles(SUPER_ADMIN, SUPPORT_SUPERVISOR, OWNER, MANAGER, CLERK),
  },

  'api_test/teardown': {
    POST: allowRoles(SUPER_ADMIN),
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
