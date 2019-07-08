import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Badgesize',
  examples: {
    '/badgesize/normal/amio/emoji.json/master/emoji-compact.json': 'normal size',
    '/badgesize/brotli/amio/emoji.json/master/emoji-compact.json': 'brotli size',
    '/badgesize/gzip/amio/emoji.json/master/emoji-compact.json': 'gzip size',
    '/badgesize/normal/https://unpkg.com/snarkdown/dist/snarkdown.js': 'arbitrary url',
  }
}

export const handlers: Handlers = {
  '/badgesize/:topic/:path+': handler
}

export default badgenServe(handlers)

async function handler ({ topic, path }: Args) {
  const endpoint = `https://img.badgesize.io/${path}.json`
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
