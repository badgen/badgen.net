import { request } from './http'

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export function restCodeberg(path: string, fullResponse: true): Promise<Response>
export function restCodeberg<T = any>(path: string, fullResponse?: false): Promise<T>
export async function restCodeberg(path: string, fullResponse = false) {
  const token = pickCodebergToken()
  const headers = {
    accept: 'application/json',
    authorization: token ? `token ${token}` : undefined,
  }
  const baseUrl = 'https://codeberg.org/api/v1'
  const response = await request(path, { baseUrl, headers })
  if (fullResponse) {
    await response.body?.cancel()
    return response
  }
  return response.json()
}

function pickCodebergToken() {
  const { CODEBERG_TOKENS } = process.env
  if (!CODEBERG_TOKENS) {
    return null
  }
  const tokens = CODEBERG_TOKENS.split(',').map(segment => segment.trim())
  return rand(tokens)
}
