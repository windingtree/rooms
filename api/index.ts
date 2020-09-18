import { NowRequest, NowResponse } from '@vercel/node'

export default (request: NowRequest, response: NowResponse) => {
  response.redirect(307, 'https://staging.rooms.windingtree.com/api/doc')
}
