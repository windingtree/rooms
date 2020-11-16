import { JWK, JWT } from 'jose'

import { getOrgDetails } from '../marketplace'
import { CError } from '../../tools'
import { AppConfig } from '../../infra/config'
import { IDecodedOrgToken, IVerifiedOrgJwtResults, IOrgDetails } from '../../types'

async function verifyOrgJwt(jwtStr: string): Promise<IVerifiedOrgJwtResults> {
  const appConfig = await AppConfig.getInstance().getConfig()

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

  const issMatch = iss.match(/did:orgid:(?<did>0x\w{64})(?:#{1})?(?<fragment>\w+)?/)
  if (issMatch === null) {
    throw new CError(401, 'Could not regexp iss.')
  }

  // Resolve did to didDocument
  const parsedIss = issMatch.groups
  if (!parsedIss) {
    throw new CError(401, 'Could not resolve did to didDocument.')
  }

  const { did, fragment } = parsedIss

  const orgDetails: IOrgDetails = await getOrgDetails(did)

  // Organization should not be disabled
  if (!orgDetails.organization.isActive) {
    throw new CError(401, `Organization: ${orgDetails.organization.id} is disabled.`)
  }

  let publicKey
  try {
    // Retrieve the Public Key PEM
    publicKey = orgDetails.organization.publicKey.filter(
      p => p.id.match(RegExp(`#${fragment}$`, 'g'))
    )[0]
  } catch (err) {
    throw new CError(401, 'Error while retrieving public key.')
  }

  if (!publicKey) {
    throw new CError(401, 'Public key definition not found in the DID document.')
  }

  const pubKeyToVerify = '-----BEGIN PUBLIC KEY-----\n' + publicKey.publicKeyPem + '\n-----END PUBLIC KEY-----'

  // Load Public Key as a JWK
  let pubKey
  try {
    pubKey = JWK.asKey(
      pubKeyToVerify,
      {
        alg: 'ES256K',
        use: 'sig',
      }
    )
  } catch (err) {
    throw new CError(401, 'Could not load the public key as JWK.')
  }

  const jwtOptions = {
    typ: 'JWT',
    aud: appConfig.WT_ROOMS_ORGID,
  }

  try {
    // Throws if the verification fails
    JWT.verify(
      jwtStr,
      pubKey,
      jwtOptions
    )
  } catch (err) {
    throw new CError(401, 'Could not verify the public key.')
  }

  return {
    aud,
    iss,
    exp,
    orgDetails
  }
}

export {
  verifyOrgJwt,
}