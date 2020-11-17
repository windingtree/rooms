import { JWT } from 'jose'

import { CError } from '../../../tools'
import { IDecodedOrgToken, IDecodedOrgIdToken } from '../../../types'

async function decodeOrgIdToken(bearerToken: string): Promise<IDecodedOrgIdToken> {
  let decodedToken
  try {
    // Decode the token using JWT library
    decodedToken = JWT.decode(bearerToken, { complete: true })
  } catch (err) {
    throw new CError(401, 'JWT token is malformed.')
  }

  const { payload: { iss } } = (decodedToken as IDecodedOrgToken)

  // Issuer should be defined
  if (typeof iss !== 'string' || iss === '') {
    throw new CError(401, 'Issuer is missing in the JWT token.')
  }

  const issMatch = iss.match(/did:orgid:(?<orgId>0x\w{64})(?:#{1})?(?<publicKeyFragment>\w+)?/)
  if (issMatch === null) {
    throw new CError(401, 'Could not parse issuer.')
  }

  // Resolve did to didDocument
  const parsedIss = issMatch.groups
  if (!parsedIss) {
    throw new CError(401, 'Could not extract orgId from issuer.')
  }

  return {
    orgId: parsedIss.orgId,
    publicKeyFragment: parsedIss.publicKeyFragment,
  }
}

export {
  decodeOrgIdToken,
}
