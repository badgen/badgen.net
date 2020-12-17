import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'MELPA',
  examples: {
    '/melpa/v/magit': 'version'
  },
  handlers: {
    '/melpa/:topic<v>/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const badgeUrl = `https://melpa.org/packages/${pkg}-badge.svg`
  const svg = await got(badgeUrl).text()
  const title = svg.match(/<title>([^<]+)<\//i)?.[1].trim()
  const ver = title?.split(':')?.[1]

  switch (topic) {
    case 'v':
      return {
        subject: 'melpa',
        status: version(ver),
        color: versionColor(ver)
      }
  }
}
