import got from 'got'

export default async function (iconUrl: string) {
  return got(iconUrl).then(res => {
    const type = res.headers['content-type']
    if (!type!.startsWith('image')) { return }

    const base64 = Buffer.from(res.body).toString('base64')
    const encoded = `data:${type};base64,${base64}`
    return encoded
  }).catch(() => undefined)
}
