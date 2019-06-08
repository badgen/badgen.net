import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Pypi',
  examples: {
    '/pypi/v/pip': 'version',
    '/pypi/v/docutils': 'version',
    '/pypi/license/pip': 'license',
  }
}

export const handlers: Handlers = {
  '/pypi/:topic<v|license>/:project': handler
}

export default badgenServe(handlers)

async function handler ({ topic, project }: Args) {
  const endpoint = `https://pypi.org/pypi/${project}/json`
  const { info } = await got(endpoint).then(res => res.body)

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
