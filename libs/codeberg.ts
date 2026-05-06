import got from './got'

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export function restCodeberg<T = any>(path: string, fullResponse = false) {
  const token = pickCodebergToken()
  const headers = token ? {
    authorization: `token ${token}`,
  } : {}
  const prefixUrl = 'https://codeberg.org/api/v1'
  const response = got.get(path, { prefixUrl, headers })
  return fullResponse ? response : response.json<T>()
}

function pickCodebergToken() {
  const { CODEBERG_TOKENS } = process.env
  if (!CODEBERG_TOKENS) {
    return null
  }
  const tokens = CODEBERG_TOKENS.split(',').map(segment => segment.trim())
  return rand(tokens)
}
