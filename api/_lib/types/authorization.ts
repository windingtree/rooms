interface IAuthorizeRulesMethods {
  [key: string]: boolean
}

interface IAuthorizeRulesRoutes {
  [key: string]: IAuthorizeRulesMethods
}

interface IAuthorizeRules {
  [key: string]: IAuthorizeRulesRoutes
}

export {
  IAuthorizeRulesMethods,
  IAuthorizeRulesRoutes,
  IAuthorizeRules,
}
