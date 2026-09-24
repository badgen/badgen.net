import { requestJson } from './http'
import { BadgenError } from './create-badgen-handler-next'

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// request github api (rest)
export function restGithub<T = any>(path: string, searchParams?: Record<string, string>) {
  const headers = {
    authorization: `Bearer ${pickGithubToken()}`,
    accept: `application/vnd.github+json`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const baseUrl = process.env.GITHUB_API || 'https://api.github.com/'
  return requestJson<T>(path, { baseUrl, headers, searchParams })
}

// request github api (graphql)
export function queryGithub<T = any>(query) {
  const headers = {
    authorization: `token ${pickGithubToken()}`,
    accept: 'application/vnd.github.hawkgirl-preview+json'
  }
  const json = { query }
  const endpoint =
    process.env.GITHUB_API_GRAPHQL || 'https://api.github.com/graphql'
  return requestJson<T>(endpoint, { method: 'POST', json, headers })
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
