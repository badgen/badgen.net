// Own upstream defaults and status validation; services own payload parsing.
// The timeout signal stays active after headers arrive, through body consumption.
export interface RequestOptions {
  baseUrl?: string
  searchParams?: URLSearchParams | Record<string, string | number | boolean | undefined>
  headers?: Record<string, string | undefined>
  method?: 'GET' | 'POST' | 'HEAD'
  json?: unknown
  redirect?: RequestRedirect
  timeout?: number
}

export class HTTPError extends Error {
  constructor (public readonly status: number) {
    super(`Upstream HTTP ${status}`)
    this.name = 'HTTPError'
  }
}

export async function request (input: string, options: RequestOptions = {}): Promise<Response> {
  const { baseUrl, searchParams, json, timeout = 6400 } = options
  // API prefixes are directories, including when configured without a trailing slash.
  const url = new URL(baseUrl ? `${baseUrl.replace(/\/$/, '')}/${input.replace(/^\//, '')}` : input)
  if (searchParams) {
    const params = searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(Object.entries(searchParams)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]))
    url.search = params.toString()
  }

  const headers = new Headers({
    'user-agent': 'Mozilla/5.0 (compatible; Badgen/1.0; +https://badgen.net)'
  })
  for (const [key, value] of Object.entries(options.headers || {})) {
    if (value !== undefined) headers.set(key, value)
  }
  if (json !== undefined && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: json === undefined ? undefined : JSON.stringify(json),
    redirect: options.redirect,
    signal: AbortSignal.timeout(timeout)
  })

  // Manual redirects are data for badge services, not upstream failures.
  if (!response.ok && !(options.redirect === 'manual' && response.status >= 300 && response.status < 400)) {
    await response.body?.cancel()
    throw new HTTPError(response.status)
  }
  return response
}

export async function requestJson<T = any> (input: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(input, {
    ...options,
    headers: { accept: 'application/json', ...options.headers }
  })
  return response.json()
}

export async function requestText (input: string, options?: RequestOptions): Promise<string> {
  const response = await request(input, options)
  return response.text()
}
