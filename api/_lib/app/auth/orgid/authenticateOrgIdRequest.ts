import { NowRequest } from '@vercel/node'

import { getOrgDetails } from '../../../data/marketplace'
import { decodeOrgIdToken, verifyOrgIdPublicKey } from '../../../app/auth'
import { getBearerToken, CError } from '../../../tools'
import { IDecodedOrgIdToken, IOrgDetails } from '../../../types'

async function authenticateOrgIdRequest(request: NowRequest): Promise<IOrgDetails> {
  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IDecodedOrgIdToken = await decodeOrgIdToken(bearerToken)
  const { orgId, publicKeyFragment } = { ...decodedToken }
  const orgDetails: IOrgDetails = await getOrgDetails(orgId)

  // Organization should not be disabled
  if (!orgDetails.organization.isActive) {
    throw new CError(401, `Organization: ${orgDetails.organization.id} is disabled.`)
  }

  await verifyOrgIdPublicKey(orgDetails, bearerToken, publicKeyFragment)

  return orgDetails
}

export {
  authenticateOrgIdRequest,
}
