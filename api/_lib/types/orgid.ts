interface IOrgJwtTokenOptions {
  priv: string
  alg: string
  aud: string
  iss: string
  fragment: string
  exp: string
  scope: string | undefined
}

interface IOrgPublicKey {
  id: string
  did: string
  publicKeyPem: string
  type: string
}

interface IOrgDetailsOrganization {
  id: string
  did: string
  publicKey: Array<IOrgPublicKey>
  owner: string
  isActive: boolean
}

interface IOrgDetails {
  organization: IOrgDetailsOrganization
}

interface IJwtOptions {
  aud: string
  iss: string
  exp: string
}

interface IDecodedOrgToken {
  payload: IJwtOptions
}

interface IVerifiedOrgJwtResults extends IJwtOptions {
  orgDetails: IOrgDetails
}

interface IDecodedOrgIdToken {
  orgId: string
  publicKeyFragment: string
}

export {
  IOrgJwtTokenOptions,
  IOrgDetails,
  IDecodedOrgToken,
  IVerifiedOrgJwtResults,
  IDecodedOrgIdToken,
}
