import ky from '../libs/ky'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Pypi',
  examples: {
    '/pypi/v/pip': 'version',
    '/pypi/v/docutils': 'version',
    '/pypi/license/pip': 'license',
  },
  handlers: {
    '/pypi/:topic<v|license>/:project': handler
  }
})

async function handler ({ topic, project }: PathArgs) {
  const endpoint = `https://pypi.org/pypi/${project}/json`
  const { info } = await ky(endpoint).then(res => res.json())

  switch (topic) {
    case 'v':
      return {
        subject: 'pypi',
        status: version(info.version),
        color: versionColor(info.version)
      }
    case 'license':
      return {
        subject: 'license',
        status: info.license || 'unknown',
        color: 'blue'
      }
  }
}
