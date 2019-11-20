import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Badgesize',
  examples: {
    '/badgesize/normal/amio/emoji.json/master/emoji-compact.json': 'normal size',
    '/badgesize/brotli/amio/emoji.json/master/emoji-compact.json': 'brotli size',
    '/badgesize/gzip/amio/emoji.json/master/emoji-compact.json': 'gzip size',
    '/badgesize/normal/unpkg.com/snarkdown/dist/snarkdown.js': 'arbitrary url',
  },
  handlers: {
    '/badgesize/:topic/:path+': handler
  }
})

async function handler ({ topic, path }: PathArgs) {
  const endpoint = `https://img.badgesize.io/https://${path}.json`
  const { prettySize, color } = await got(endpoint, {
    query: {
      compression: topic === 'normal' ? '' : topic
    }
  }).then(res => res.body)

  return {
    subject: topic === 'normal' ? 'size' : `${topic} size`,
    status: prettySize,
    color: color
  }
}
