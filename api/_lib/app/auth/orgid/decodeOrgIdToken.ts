import { JWT } from 'jose'

import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IDecodedOrgToken, IDecodedOrgIdToken } from '../../../../_lib/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function decodeOrgIdToken(bearerToken: string): Promise<IDecodedOrgIdToken> {
  let decodedToken
  try {
    // Decode the token using JWT library
    decodedToken = JWT.decode(bearerToken, { complete: true })
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'JWT token is malformed.')
  }

  const { payload: { iss } } = (decodedToken as IDecodedOrgToken)

  // Issuer should be defined
  if (typeof iss !== 'string' || iss === '') {
    throw new CError(UNAUTHORIZED, 'Issuer is missing in the JWT token.')
  }

  const issMatch = iss.match(/did:orgid:(?<orgId>0x\w{64})(?:#{1})?(?<publicKeyFragment>\w+)?/)
  if (issMatch === null) {
    throw new CError(UNAUTHORIZED, 'Could not parse issuer.')
  }

  // Resolve did to didDocument
  const parsedIss = issMatch.groups
  if (!parsedIss) {
    throw new CError(UNAUTHORIZED, 'Could not extract orgId from issuer.')
  }

  return {
    orgId: parsedIss.orgId,
    publicKeyFragment: parsedIss.publicKeyFragment,
  }
}

export {
  decodeOrgIdToken,
}
