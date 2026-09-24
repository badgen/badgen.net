import { request } from './http'

export default async function (iconUrl: string) {
  return request(iconUrl).then(async res => {
    const type = res.headers.get('content-type')
    if (!type?.startsWith('image/')) {
      await res.body?.cancel()
      return
    }

    const base64 = Buffer.from(await res.arrayBuffer()).toString('base64')
    const encoded = `data:${type};base64,${base64}`
    return encoded
  }).catch(() => undefined)
}
