import { NowRequest } from '@vercel/node'

import { getOrgDetails } from '../../../../_lib/data/marketplace'
import { decodeOrgIdToken, verifyOrgIdPublicKey } from '../../../../_lib/app/auth'
import { getBearerToken, CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IDecodedOrgIdToken, IOrgDetails } from '../../../../_lib/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function authenticateOrgIdRequest(request: NowRequest): Promise<IOrgDetails> {
  const bearerToken: string = await getBearerToken(request)
  const decodedToken: IDecodedOrgIdToken = await decodeOrgIdToken(bearerToken)
  const { orgId, publicKeyFragment } = { ...decodedToken }
  const orgDetails: IOrgDetails = await getOrgDetails(orgId)

  // Organization should not be disabled
  if (!orgDetails.organization.isActive) {
    throw new CError(UNAUTHORIZED, `Organization: ${orgDetails.organization.id} is disabled.`)
  }

  await verifyOrgIdPublicKey(orgDetails, bearerToken, publicKeyFragment)

  return orgDetails
}

export {
  authenticateOrgIdRequest,
}
