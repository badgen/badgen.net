import byteSize from 'byte-size'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const METACPAN_API_URL = 'https://fastapi.metacpan.org/v1/'

const client = got.extend({ prefixUrl: METACPAN_API_URL })

export default createBadgenHandler({
  title: 'CPAN',
  examples: {
    '/cpan/v/App::cpanminus': 'version',
    '/cpan/license/Perl::Tidy': 'license',
    '/cpan/size/Moose': 'size'
  },
  handlers: {
    '/cpan/:topic<v|license|size>/:distribution': handler,
  }
})

async function handler ({ topic, distribution }: PathArgs) {
  distribution = distribution.replace(/::/g, '-');
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
      const license = licenses.join(' or ');
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'green'
      }
    }
    case 'size':
      return {
        subject: 'distrib size',
        status: byteSize(stat.size, { units: 'iec' }).toString().replace(/iB\b/, 'B'),
        color: 'blue'
      }
  }
}
