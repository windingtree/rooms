import { NowRequest, NowResponse } from '@vercel/node'

function isRoomValid(request: NowRequest, response: NowResponse): boolean {
  if (!request.body) {
    response.status(500).json({ err: 'must provide a valid body with request' })
    return false
  }

  if (
    (typeof request.body.roomNumber !== 'number') &&
    (
      (typeof request.body.roomNumber !== 'string') ||
      (Number.isNaN(parseInt(request.body.roomNumber)))
    )
  ) {
    response.status(500).json({ err: 'must provide a valid room number' })
    return false
  }

  if (
    (typeof request.body.roomType !== 'string') ||
    (request.body.roomType.length === 0)
  ) {
    response.status(500).json({ err: 'must provide a valid room type' })
    return false
  }

  return true
}

export {
  isRoomValid
}
