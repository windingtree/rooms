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

async function validateOptionalRole(propName: string, _value: unknown): Promise<string|undefined> {
  let value: string|undefined = undefined

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
  } else if (typeof _value !== 'undefined') {
    throw new CError(BAD_REQUEST, `Property '${propName}' is optional. If provided, it must have a proper Profile Role value.`)
  }

  return value
}

export { validateOptionalRole }
