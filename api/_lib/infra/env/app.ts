const COMMIT_REF: string = process.env.VERCEL_GITHUB_COMMIT_REF || '{branch_name}'
const COMMIT_SHA: string = process.env.VERCEL_GITHUB_COMMIT_SHA || '{commit_hash}'

const APP_VERSION = `${COMMIT_REF}:${COMMIT_SHA}`

const APP_ENV_ENCRYPTION_DETAILS: string = process.env.ENV_ENCRYPTION_DETAILS || ''

export {
  APP_VERSION,
  APP_ENV_ENCRYPTION_DETAILS,
}
