interface IOrgPublicKey {
  id: string
  publicKeyPem: string
  type: string
}

interface IOrgDetails {
  organization: {
    id: string
    did: string
    publicKey: IOrgPublicKey[]
    owner: string
    isActive: boolean
  }
}

interface IDecodedOrgToken {
  payload: {
    exp: string
    aud: string
    iss: string
  }
}

interface IVerifiedOrgJwtResults {
  aud: string
  iss: string
  exp: string
  didResult: IOrgDetails
}

export {
  IOrgDetails,
  IDecodedOrgToken,
  IVerifiedOrgJwtResults,
}
