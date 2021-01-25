import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IProfileRole } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const {
  SUPER_ADMIN,
  SUPPORT_SUPERVISOR,
  SUPPORT_AGENT,
  OWNER,
  MANAGER,
  CLERK,
} = CONSTANTS.PROFILE_ROLE

async function validateRequiredRole(propName: string, _value: unknown): Promise<string> {
  let value: string

  const VALID_ROLES: Array<keyof IProfileRole> = [
    SUPER_ADMIN,
    SUPPORT_SUPERVISOR,
    SUPPORT_AGENT,
    OWNER,
    MANAGER,
    CLERK,
  ]

  if (typeof _value === 'string' && VALID_ROLES.includes((_value as keyof IProfileRole))) {
    value = _value
  } else {
    throw new CError(BAD_REQUEST, `Property '${propName}' is required. It must have a proper Profile Role value.`)
  }

  return value
}

export { validateRequiredRole }
