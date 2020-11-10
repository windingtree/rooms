import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

const COMMIT_REF: string = process.env.VERCEL_GITHUB_COMMIT_REF || '{branch_name}'
const COMMIT_SHA: string = process.env.VERCEL_GITHUB_COMMIT_SHA || '{commit_hash}'

const APP_VERSION = `${COMMIT_REF}:${COMMIT_SHA}`

export {
  APP_VERSION,
}
