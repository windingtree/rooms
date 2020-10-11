import { NowRequest, NowResponse } from '@vercel/node'

type TMethodFunc = (request: NowRequest, response: NowResponse) => Promise<void>

interface IMethodHandlerHash {
  [methodName: string]: TMethodFunc|undefined

  // All available HTTP methods. As defined in RFC 7231, and RFC 5789.
  GET?: TMethodFunc
  HEAD?: TMethodFunc
  POST?: TMethodFunc
  PUT?: TMethodFunc
  DELETE?: TMethodFunc
  CONNECT?: TMethodFunc
  OPTIONS?: TMethodFunc
  TRACE?: TMethodFunc
  PATCH?: TMethodFunc
}

export {
  TMethodFunc,
  IMethodHandlerHash,
}
