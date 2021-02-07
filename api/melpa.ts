import got from '../libs/got'
import { isBadge, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'MELPA',
  examples: {
    '/melpa/v/magit': 'version'
  },
  handlers: {
    '/melpa/:topic<v|version>/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const badgeUrl = `https://melpa.org/packages/${pkg}-badge.svg`
  const resp = await got(badgeUrl)
  const params = isBadge(resp) && parseBadge(resp.body, topic)
  return params || {
    subject: 'melpa',
    status: 'unknown',
    color: 'grey'
  }
}

function parseBadge(svg: string, topic: string) {
  const title = svg.match(/<title>([^<]+)<\//i)?.[1].trim() ?? ''
  const [_, ver] = title.split(':')
  if (!ver) return

  switch (topic) {
    case 'v':
    case 'version':
      return {
        subject: 'melpa',
        status: version(ver),
        color: versionColor(ver)
      }
  }
}
