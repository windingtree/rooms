import { JWK, JWT } from 'jose'

import { getOrgDetails } from '../marketplace'
import { CError } from '../../tools'
import { IDecodedOrgToken, IVerifiedOrgJwtResults } from '../../types'

async function verifyOrgJwt(jwtStr: string): Promise<IVerifiedOrgJwtResults> {
  let decodedToken
  try {
    // Decode the token using JWT library
    decodedToken = JWT.decode(jwtStr, {
      complete: true
    })
  } catch (err) {
    throw new CError(401, 'JWT token is malformed.')
  }

  const { payload: { exp, aud, iss } } = (decodedToken as IDecodedOrgToken)

  // Issuer should be defined
  if (!iss || iss === '') {
    throw new CError(401, 'ORG.ID is missing in the JWT token.')
  }

  const issMatch = iss.match(/(?<did>did:orgid:0x\w{64})(?:#{1})?(?<fragment>\w+)?/)
  if (issMatch === null) {
    throw new CError(401, 'Could not regexp iss.')
  }

  // Resolve did to didDocument
  const parsedIss = issMatch.groups
  if (!parsedIss) {
    throw new CError(401, 'Could not resolve did to didDocument.')
  }

  const { did, fragment } = parsedIss

  const didResult = await getOrgDetails(did)

  // Organization should not be disabled
  if (!didResult.organization.isActive) {
    throw new CError(401, `Organization: ${didResult.organization.id} is disabled.`)
  }

  let publicKey
  try {
    // Retrieve the Public Key PEM
    publicKey = didResult.organization.publicKey.filter(
      p => p.id.match(RegExp(`#${fragment}$`, 'g'))
    )[0]
  } catch (err) {
    throw new CError(401, 'Error while retrieving public key.')
  }

  if (!publicKey) {
    throw new CError(401, 'Public key definition not found in the DID document.')
  }

  if (!publicKey.publicKeyPem.match(RegExp('PUBLIC KEY', 'gi'))) {
    publicKey.publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKey.publicKeyPem}\n-----END PUBLIC KEY-----`
  }

  // Load Public Key as a JWK
  let pubKey
  try {
    pubKey = JWK.asKey(
      publicKey.publicKeyPem,
      {
        alg: 'ES256K',
        use: 'sig',
      }
    )
  } catch (err) {
    throw new CError(401, 'Could not load the public key as JWK.')
  }

  try {
    // Throws if the verification fails
    JWT.verify(
      jwtStr,
      pubKey,
      {
        typ: 'JWT',
        audience: 'replaceWithYourDid'
      }
    )
  } catch (err) {
    throw new CError(401, 'Could not verify the public key.')
  }

  return {
    aud,
    iss,
    exp,
    didResult
  }
}

export {
  verifyOrgJwt,
}
