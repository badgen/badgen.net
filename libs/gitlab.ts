import { request, requestJson } from './http'

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
  return requestJson(endpoint, { method: 'POST', json, headers })
}

export function restGitlab(path: string): Promise<Response> {
  const token = pickGitlabToken()
  const headers = {
    accept: 'application/json',
    authorization: token ? `Bearer ${token}` : undefined,
  }
  const baseUrl = process.env.GITLAB_API || 'https://gitlab.com/api/v4'
  return request(path, { baseUrl, headers })
}

function pickGitlabToken() {
  const { GITLAB_TOKENS } = process.env
  if (!GITLAB_TOKENS) {
    return null
  }
  const tokens = GITLAB_TOKENS.split(',').map(segment => segment.trim())
  return rand(tokens)
}
