import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Badgesize',
  examples: {
    '/badgesize/normal/amio/emoji.json/master/emoji-compact.json': 'normal size',
    '/badgesize/gzip/amio/emoji.json/master/emoji-compact.json': 'gzip size',
    '/badgesize/brotli/amio/emoji.json/master/emoji-compact.json': 'brotli size',
    '/badgesize/normal/file-url/https/unpkg.com/snarkdown/dist/snarkdown.js': 'arbitrary url',
    '/badgesize/normal/file-url/unpkg.com/snarkdown/dist/snarkdown.js': 'arbitrary url',
  },
  handlers: {
    '/badgesize/:topic/file-url/:protocol<https?:?>/:hostname/:pathname+': urlHandler,
    '/badgesize/:topic/file-url/:hostname/:pathname+': urlHandler,
    '/badgesize/:topic/:protocol<https?:?>/:hostname/:pathname+': urlHandler,
    '/badgesize/:topic/:owner/:repo/:path+': githubHandler
  }
})

function githubHandler ({ topic, owner, repo, path }: PathArgs) {
  path = [owner, repo, path].join('/')
  return badgesize({ path, topic })
}

function urlHandler ({ topic, protocol = 'https:', hostname, pathname }: PathArgs) {
  const url = protocol.replace(/:?$/, `://${hostname}/${pathname}`)
  return badgesize({ path: url, topic })
}

async function badgesize ({ path, topic }) {
  const endpoint = `https://img.badgesize.io/${path}.json`
  const searchParams = new URLSearchParams()
  if (topic !== 'normal') searchParams.set('compression', topic)
  const { prettySize, color } = await got(endpoint, { searchParams }).json<any>()

  return {
    subject: topic === 'normal' ? 'size' : `${topic} size`,
    status: prettySize,
    color: color
  }
}
