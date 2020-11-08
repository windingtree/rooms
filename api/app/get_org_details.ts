import { GraphQLClient } from 'graphql-request'

import { IOrgDetails } from '../types'

function makeGraphqlRequest(orgId: string): Promise<IOrgDetails> {
  let resolutionFunc
  let rejectionFunc

  const resultsPromise = new Promise<IOrgDetails>((_resolutionFunc, _rejectionFunc) => {
    resolutionFunc = _resolutionFunc
    rejectionFunc = _rejectionFunc
  })

  const query = `{
    organization(id:'${orgId}') {
      id
      did
      publicKey {
        id
        publicKeyPem
        type
      }
      owner
      isActive
    }
  }`
  const url = 'https://api.thegraph.com/subgraphs/name/windingtree/orgid-subgraph-ropsten'

  const client = new GraphQLClient(url, { headers: {} })

  client.request(url, query)
    .then(resolutionFunc)
    .catch(rejectionFunc)

  return resultsPromise
}

async function getOrgDetails(orgId: string): Promise<IOrgDetails> {
  let orgDetails

  try {
    orgDetails = await makeGraphqlRequest(orgId)
  } catch (err) {
    throw new Error(err)
  }

  return orgDetails
}

export {
  getOrgDetails,
}
