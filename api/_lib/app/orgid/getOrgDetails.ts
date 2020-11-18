import { getOrgDetails as getOrgDetailsRecord } from '../../data/marketplace'
import { IOrgDetails } from '../../types'

async function getOrgDetails(orgId: string): Promise<IOrgDetails> {
  // TODO: Try to get `orgDetails` from cache first.

  const orgDetails: IOrgDetails = await getOrgDetailsRecord(orgId)

  return orgDetails
}

export {
  getOrgDetails,
}
