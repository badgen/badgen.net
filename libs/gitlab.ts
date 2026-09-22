import type { Response } from 'got'
import got from './got'

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// request gitlab api v4 (graphql)
export function queryGitlab<T = any>(query: string): Promise<T> {
  const token = pickGitlabToken()
  const headers = {
    authorization: token ? `Bearer ${token}` : undefined,
  }
  const json = { query }
  const endpoint =
    process.env.GITLAB_API_GRAPHQL || 'https://gitlab.com/api/graphql'
  return got.post(endpoint, { json, headers }).json()
}

export function restGitlab<T = any>(path: string): Promise<Response<T>> {
  const token = pickGitlabToken()
  const headers = {
    authorization: token ? `Bearer ${token}` : undefined,
  }
  const prefixUrl = process.env.GITLAB_API || 'https://gitlab.com/api/v4'
  return got.get(path, { prefixUrl, headers, responseType: 'json' })
}

function pickGitlabToken() {
  const { GITLAB_TOKENS } = process.env
  if (!GITLAB_TOKENS) {
    return null
  }
  const tokens = GITLAB_TOKENS.split(',').map(segment => segment.trim())
  return rand(tokens)
}
