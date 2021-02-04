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
    '/cpan/dependents/DateTime': 'dependents',
    '/cpan/likes/DBIx::Class': 'likes'
  },
  handlers: {
    '/cpan/:topic<v|version|license|size|perl|dependents|likes>/:distribution': handler
  }
})

async function handler ({ topic, distribution }: PathArgs) {
  distribution = distribution.replace(/::/g, '-')

  switch (topic) {
    case 'v':
    case 'version': {
      const release = await client.get(`release/${distribution}`).json<any>()
      const ver = normalizeVersion(release.version)
      return {
        subject: 'cpan',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      const release = await client.get(`release/${distribution}`).json<any>()
      const license = release.license?.join(' or ')
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'green'
      }
    }
    case 'size': {
      const { stat } = await client.get(`release/${distribution}`).json<any>()
      return {
        subject: 'distrib size',
        status: size(stat.size),
        color: 'blue'
      }
    }
    case 'perl': {
      const { metadata } = await client.get(`release/${distribution}`).json<any>()
      const perlVersion = normalizeVersion(metadata.prereqs?.runtime?.requires?.perl)
      return {
        subject: 'perl',
        status: version(perlVersion),
        color: versionColor(perlVersion)
      }
    }
    case 'dependents': {
      const searchParams = { page_size: 1 }
      const data = await client.get(`reverse_dependencies/dist/${distribution}`, { searchParams }).json<any>()
      return {
        subject: 'dependents',
        status: millify(data.total),
        color: 'green'
      }
    }
    case 'likes': {
      const searchParams = { distribution }
      const { favorites } = await client.get('favorite/agg_by_distributions', { searchParams }).json<any>()
      const likes = favorites[distribution]
      return {
        subject: 'likes',
        status: millify(likes),
        color: 'green'
      }
    }
  }
}

// https://metacpan.org/pod/version
function normalizeVersion(version: string): string {
  version = version.replace(/_/g, '')
  if (!version || version.startsWith('v')) {
    return version
  }
  const [major, rest] = version.split('.')
  const minor = rest.slice(0, 3)
  const patch = rest.slice(3).padEnd(3, '0')
  return [major, minor, patch].map(Number).join('.')
}
