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
  title: 'OCaml Package Manager',
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
  const info: PackageInfo = { version: '', license: '', downloads: NaN }
  
  const $ = cheerio.load(html)
  const text = (selector: any) => $(selector).text().trim()

  info.version = text($('.package-version').first())
  $('.package-info th').filter((_, el) => {
    const $el = $(el)
    const label = text($el).toLowerCase()
    if (label === 'license') {
      info.license = text($el.next())
    } else if (label === 'statistics') {
      info.downloads = parseInt(text($el.next().find('strong')), 0)
    }
    return !info.license && isNaN(info.downloads)
  })
  return info
}
