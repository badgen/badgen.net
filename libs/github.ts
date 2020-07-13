import got from './got'
import { BadgenError } from './create-badgen-handler'

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// request github api v3 (rest)
export function restGithub<T = any>(path: string, preview = 'hellcat') {
  const headers = {
    authorization: `token ${pickGithubToken()}`,
    accept: `application/vnd.github.${preview}-preview+json`
  }
  const prefixUrl = process.env.GITHUB_API || 'https://api.github.com/'
  return got.get(path, { prefixUrl, headers }).json<T>()
}

// request github api v4 (graphql)
export function queryGithub<T = any>(query) {
  const headers = {
    authorization: `token ${pickGithubToken()}`,
    accept: 'application/vnd.github.hawkgirl-preview+json'
  }
  const json = { query }
  const endpoint =
    process.env.GITHUB_API_GRAPHQL || 'https://api.github.com/graphql'
  return got.post(endpoint, { json, headers }).json<T>()
}

function pickGithubToken() {
  const { GH_TOKENS, GITHUB_TOKENS } = process.env
  const githubTokens = GITHUB_TOKENS || GH_TOKENS
  if (!githubTokens) {
    throw new BadgenError({ status: 'token required' })
  }
  const tokens = githubTokens.split(',').map(segment => segment.trim())
  return rand(tokens)
}
