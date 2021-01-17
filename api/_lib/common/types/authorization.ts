// common imports
import { IProfileRoleEnum } from '../types'

type IAuthorizeRulesRoles = {
  [key in IProfileRoleEnum]?: boolean
}

interface IAuthorizeRulesMethods {
  [key: string]: IAuthorizeRulesRoles
}

interface IAuthorizeRules {
  [key: string]: IAuthorizeRulesMethods
}

interface IAuthorizeRequestAction {
  method: string
  route: string
}

export {
  IAuthorizeRulesRoles,
  IAuthorizeRulesMethods,
  IAuthorizeRules,
  IAuthorizeRequestAction,
}
