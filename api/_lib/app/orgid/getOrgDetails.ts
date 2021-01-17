// data layer imports
import { getOrgDetails as getOrgDetailsRecord } from '../../data/marketplace'

// common imports
import { IOrgDetails } from '../../common/types'

async function getOrgDetails(orgId: string): Promise<IOrgDetails> {
  // TODO: Try to get `orgDetails` from cache first.

  const orgDetails: IOrgDetails = await getOrgDetailsRecord(orgId)

  return orgDetails
}

export {
  getOrgDetails,
}
