import got from './got'

export default async function (iconUrl: string) {
  return got.get(iconUrl, { responseType: 'buffer' }).then(res => {
    const type = res.headers['content-type']
    if (!type?.startsWith('image/')) { return }

    const base64 = Buffer.from(res.rawBody).toString('base64')
    const encoded = `data:${type};base64,${base64}`
    return encoded
  }).catch(() => undefined)
}
