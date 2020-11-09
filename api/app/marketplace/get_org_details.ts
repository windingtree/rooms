import { GraphQLClient, gql } from 'graphql-request'

import { IOrgDetails } from '../../types'
import { WT_THEGRAPH_API_URL } from '../../constants'
import { CError } from '../../tools'

function makeGraphqlRequest(orgId: string): Promise<IOrgDetails> {
  let resolutionFunc: (data: IOrgDetails) => void
  let rejectionFunc: (err: unknown) => void

  const resultsPromise = new Promise<IOrgDetails>((_resolutionFunc, _rejectionFunc) => {
    resolutionFunc = _resolutionFunc
    rejectionFunc = _rejectionFunc
  })

  const graphQLClient = new GraphQLClient(WT_THEGRAPH_API_URL, { headers: {} })

  const query = gql`
    {
      organization(id: "${orgId}") {
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
    }
  `

  graphQLClient.request(query)
    .then((data: IOrgDetails) => {
      if (!data || !data.organization) {
        throw 'Could not retrieve organization data.'
      }

      resolutionFunc(data)
    })
    .catch((err: unknown) => {
      rejectionFunc(err)
    })

  return resultsPromise
}

async function getOrgDetails(orgId: string): Promise<IOrgDetails> {
  let orgDetails

  try {
    orgDetails = await makeGraphqlRequest(orgId)
  } catch (err) {
    throw new CError(500, `Could not resolve org details for orgId '${orgId}'.`)
  }

  return orgDetails
}

export {
  getOrgDetails,
}
