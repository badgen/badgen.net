import cheerio from 'cheerio'
import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const OPAM_REPO_URL = 'https://opam.ocaml.org/packages/'

type PackageInfo = {
  version: string,
  license: string,
  downloads: number
}

export default createBadgenHandler({
  title: 'opam',
  examples: {
    '/opam/v/merlin': 'version',
    '/opam/v/ocamlformat': 'version',
    '/opam/dm/lwt': 'monthly downloads',
    '/opam/license/cohttp': 'license'
  },
  handlers: {
    '/opam/:topic/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const html = await got(pkg, { prefixUrl: OPAM_REPO_URL }).text()
  const {
    downloads,
    license,
    version: ver
  } = await getPackageInfo(html)

  switch (topic) {
    case 'v': {
      return {
        subject: 'opam',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'dm': {
      return {
        subject: 'downloads',
        status: millify(downloads) + '/month',
        color: 'green'
      }
    }
  }
}

function getPackageInfo(html: string): PackageInfo {
  const $ = cheerio.load(html)
  const info: PackageInfo = { version: '', license: '', downloads: 0 }
  info.version = $('.package-version').first().text()
  return $('.package-info th').get().reduce((acc, el) => {
    const $el = $(el)
    const text = $el.text().toLowerCase()
    if (text === 'license') {
      acc.license = $el.next().text()
      return acc
    }
    if (text === 'statistics') {
      acc.downloads = parseInt($el.next().find('strong').text(), 0)
      return acc
    }
    return acc
  }, info)
}