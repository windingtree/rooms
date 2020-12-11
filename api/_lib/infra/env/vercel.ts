const VERCEL_GITHUB_COMMIT_REF: string = process.env.VERCEL_GITHUB_COMMIT_REF || '{branch_name}'
const VERCEL_GITHUB_COMMIT_SHA: string = process.env.VERCEL_GITHUB_COMMIT_SHA || '{commit_hash}'

export {
  VERCEL_GITHUB_COMMIT_REF,
  VERCEL_GITHUB_COMMIT_SHA,
}
