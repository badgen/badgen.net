import got from '../libs/got'
import { millify, version, versionColor, size } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const METACPAN_API_URL = 'https://fastapi.metacpan.org/v1/'

const client = got.extend({ prefixUrl: METACPAN_API_URL })

export default createBadgenHandler({
  title: 'CPAN',
  examples: {
    '/cpan/v/App::cpanminus': 'version',
    '/cpan/license/Perl::Tidy': 'license',
    '/cpan/perl/Plack': 'perl version',
    '/cpan/size/Moose': 'size',
    '/cpan/likes/DBIx::Class': 'likes'
  },
  handlers: {
    '/cpan/:topic<v|license|size>/:distribution': apiHandler,
    '/cpan/:topic<perl|likes>/:distribution': webHandler
  }
})

async function apiHandler ({ topic, distribution }: PathArgs) {
  distribution = distribution.replace(/::/g, '-')
  const {
    license: licenses,
    version: ver,
    stat
  } = await client.get(`release/${distribution}`).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: 'cpan',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'license': {
      const license = licenses.join(' or ')
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'green'
      }
    }
    case 'size':
      return {
        subject: 'distrib size',
        status: size(stat.size),
        color: 'blue'
      }
  }
}

async function webHandler ({ topic, distribution }: PathArgs) {
  distribution = distribution.replace(/::/g, '-')
  const url = `https://metacpan.org/release/${distribution}`
  const html = await got.get(url).text()

  switch (topic) {
    case 'perl': {
      const perlVersion = html.match(/>Perl:\s*([^<]+?)\s*<\//i)?.[1] ?? ''
      return {
        subject: 'perl',
        status: version(perlVersion),
        color: versionColor(perlVersion)
      }
    }
    case 'likes': {
      const likes = Number(html.match(/class="favorite[^"]*?"><span>([^<]+)<\//i)?.[1])
      return {
        subject: 'likes',
        status: millify(likes),
        color: 'green'
      }
    }
  }
}
