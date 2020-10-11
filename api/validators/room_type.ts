import { NowRequest } from '@vercel/node'

function checkRoomType(request: NowRequest): void {
  if (!request.body) {
    throw 'must provide a valid body with request'
  }

  if (
    (typeof request.body.quantity !== 'number') &&
    (
      (typeof request.body.quantity !== 'string') ||
      (Number.isNaN(parseInt(request.body.quantity)))
    )
  ) {
    throw 'must provide a valid quantity value'
  }

  if (
    (typeof request.body.price !== 'number') &&
    (
      (typeof request.body.price !== 'string') ||
      (Number.isNaN(parseInt(request.body.price)))
    )
  ) {
    throw 'must provide a valid price value'
  }

  if (
    (typeof request.body.type !== 'string')
  ) {
    throw 'must provide a valid type value'
  }

  if (
    (typeof request.body.amenities !== 'string')
  ) {
    throw 'must provide a valid amenities value'
  }
}

export {
  checkRoomType
}
