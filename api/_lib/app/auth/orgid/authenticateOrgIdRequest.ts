import { NowRequest } from '@vercel/node'

import { decodeOrgIdToken, verifyOrgIdPublicKey } from '../../../app/auth/orgid'

import { getOrgDetails } from '../../../data/marketplace'

import { CONSTANTS } from '../../../common/constants'
import { getBearerToken, CError } from '../../../common/tools'
import { IDecodedOrgIdToken, IOrgDetails } from '../../../common/types'

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

export { authenticateOrgIdRequest }
