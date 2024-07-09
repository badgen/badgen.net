import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const OPAM_REPO_URL = 'https://opam.ocaml.org/packages/'

export default createBadgenHandler({
  title: 'OCaml Package Manager',
  examples: {
    '/opam/v/merlin': 'version',
    '/opam/v/ocamlformat': 'version',
    '/opam/license/cohttp': 'license'
  },
  handlers: {
    '/opam/:topic/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const html = await got(pkg, { prefixUrl: OPAM_REPO_URL }).text()

  switch (topic) {
    case 'v': {
      const ver = html.match(/class="package-version">([^<]+)<\//i)?.[1] ?? ''
      return {
        subject: 'opam',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      const license = html.match(/<th>license<\/th>\s*<td>([^<]+)<\//i)?.[1] ?? ''
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
  }
}
