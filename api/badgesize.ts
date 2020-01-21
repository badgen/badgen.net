import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Badgesize',
  examples: {
    '/badgesize/normal/amio/emoji.json/master/emoji-compact.json': 'normal size',
    '/badgesize/brotli/amio/emoji.json/master/emoji-compact.json': 'brotli size',
    '/badgesize/gzip/amio/emoji.json/master/emoji-compact.json': 'gzip size',
    '/badgesize/normal/https/unpkg.com/snarkdown/dist/snarkdown.js': 'arbitrary url',
  },
  handlers: {
    '/badgesize/:topic/:path+': handler
  }
})

async function handler ({ topic, path }: PathArgs) {
  if (path.startsWith('http/')) {
    path = path.slice(0, 4) + ':/' + path.slice(4)
  } else if (path.startsWith('https/')) {
    path = path.slice(0, 5) + ':/' + path.slice(5)
  } else if (path.startsWith('http:/')) {
    path = path.slice(0, 5) + '/' + path.slice(5)
  } else if (path.startsWith('https:/')) {
    path = path.slice(0, 6) + '/' + path.slice(6)
  }
  const endpoint = `https://img.badgesize.io/${path}.json`
  const { prettySize, color } = await ky(endpoint, {
    searchParams: {
      compression: topic === 'normal' ? '' : topic
    }
  }).then(res => res.json())

  return {
    subject: topic === 'normal' ? 'size' : `${topic} size`,
    status: prettySize,
    color: color
  }
}
