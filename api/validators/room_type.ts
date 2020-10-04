import { NowRequest, NowResponse } from '@vercel/node'

function isRoomTypeValid(request: NowRequest, response: NowResponse): boolean {
  if (!request.body) {
    response.status(500).json({ err: 'must provide a valid body with request' })
    return false
  }

  if (
    (typeof request.body.quantity !== 'number') &&
    (
      (typeof request.body.quantity !== 'string') ||
      (Number.isNaN(parseInt(request.body.quantity)))
    )
  ) {
    response.status(500).json({ err: 'must provide a valid quantity value' })
    return false
  }

  if (
    (typeof request.body.price !== 'number') &&
    (
      (typeof request.body.price !== 'string') ||
      (Number.isNaN(parseInt(request.body.price)))
    )
  ) {
    response.status(500).json({ err: 'must provide a valid price value' })
    return false
  }

  if (
    (typeof request.body.type !== 'string') ||
    (request.body.type.length === 0)
  ) {
    response.status(500).json({ err: 'must provide a valid type value' })
    return false
  }

  return true
}

export {
  isRoomTypeValid
}
