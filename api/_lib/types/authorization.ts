interface IAuthorizeRulesRoles {
  [key: string]: boolean
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
