import { JWK, JWT } from 'jose'

import { IOrgJwtTokenOptions } from '../../../../_lib/types'

function genOptions(
  privKey: string,
  origin: string,
  recipient: string,
  fragment = 'webserver',
  time = '1 year',
  scope: string | undefined = undefined
): IOrgJwtTokenOptions {
  return {
    priv: privKey,
    alg: 'ES256K',
    iss: `did:orgid:${origin}`,
    aud: `did:orgid:${recipient}`,
    fragment: fragment,
    exp: time,
    scope: scope,
  }
}

function createToken(options: IOrgJwtTokenOptions) {
  const priv = JWK.asKey(
    options.priv,
    {
      alg: options.alg,
      use: 'sig',
    }
  )

  return JWT.sign(
    {
      ...(options.scope ? { scope: options.scope } : {})
    },
    priv,
    {
      audience: options.aud,
      ...(options.iss ? { issuer: `${options.iss}${options.fragment ? '#' + options.fragment : ''}` } : {}),
      expiresIn: options.exp,
      kid: false,
      header: { typ: 'JWT' }
    }
  )
}

function generateOrgIdJwt(privPem: string, originOrgId: string, recipientOrgId: string, fragment: string): string {
  const options = genOptions(privPem, originOrgId, recipientOrgId, fragment)

  return createToken(options)
}

export {
  generateOrgIdJwt,
}
