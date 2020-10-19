import { NowRequest, NowResponse } from '@vercel/node'
import { genericApiMethodHandler } from '../tools'

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, {})
}

/* --------------- internal API methods/structure below --------------- */

export {
  createRoomType,
  getRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypes,
} from './room_type'
