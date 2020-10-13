import { NowRequest } from '@vercel/node'

function checkSendOneTimePass(request: NowRequest): void {
  if (!request.body) {
    throw 'must provide a valid body with request'
  }

  if (
    (typeof request.body.email !== 'string')
  ) {
    throw 'must provide a valid email value'
  }

  if (
    (request.body.email.length === 0)
  ) {
    throw 'email value must not be empty'
  }

  if (
    (typeof request.body.sessionToken !== 'string')
  ) {
    throw 'must provide a valid sessionToken value'
  }

  if (
    (request.body.sessionToken.length === 0)
  ) {
    throw 'sessionToken value must not be empty'
  }
}

export {
  checkSendOneTimePass,
}
