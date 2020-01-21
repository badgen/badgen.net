import ky from '../libs/ky'

export default async function (iconUrl) {
  return ky(iconUrl).then(async res => {
    const type = res.headers['content-type']
    if (!type!.startsWith('image')) { return }

    const base64 = Buffer.from(await res.json()).toString('base64')
    const encoded = `data:${type};base64,${base64}`
    return encoded
  }).catch(err => undefined)
}
