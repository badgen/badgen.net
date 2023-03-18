import got from '../libs/got'
import { size, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const uniq = <T = any>(arr: T[]) => [...new Set(arr)]

const packageQuery = `
  query packageQuery($name: String!, $version: String) {
    packageVersion: getPackageVersion(name: $name, version: $version) {
      version
      license
      createdAt
      distribution { size }
      commands {
        command
        module { name }
      }
      modules {
        name
        abi
      }
    }
  }
`

export default createBadgenHandler({
  title: 'wapm',
  examples: {
    '/wapm/v/zamfofex/greg': 'version',
    '/wapm/v/cowsay': 'version',
    '/wapm/license/huhn/hello-wasm': 'license',
    '/wapm/size/coreutils': 'size',
    '/wapm/abi/jwmerrill/lox-repl': 'abi',
    '/wapm/abi/kherrick/pwgen': 'abi'
  },
  handlers: {
    '/wapm/:topic<v|license|size|abi>/:namespace/:pkg': handler,
    '/wapm/:topic<v|license|size|abi>/:pkg': handler
  }
})

async function handler ({ topic, pkg, namespace }: PathArgs) {
  const info = await fetchMetadata(pkg, namespace)

  switch (topic) {
    case 'v':
      return {
        subject: 'wapm',
        status: version(info.version),
        color: versionColor(info.version)
      }
    case 'license':
      return {
        subject: 'license',
        status: info.license || 'unknown',
        color: 'blue'
      }
    case 'size':
      return {
        subject: 'distrib size',
        status: size(info.distribution.size),
        color: 'green'
      }
    case 'abi':
      const supportedABIs = uniq(info.modules.map(m => m.abi)).sort().join(' | ')
      return {
        subject: 'abi',
        status: supportedABIs || 'unknown',
        color: supportedABIs ? 'blue' : 'grey'
      }
  }
}

function fetchMetadata(pkg, namespace = '_') {
  const name = `${namespace}/${pkg}`
  return queryWapm(packageQuery, 'packageQuery', { name })
    .then(res => res.data!.packageVersion)
}

function queryWapm<T = any>(query, operationName, variables) {
  const json = { query, operationName, variables }
  const endpoint =
    process.env.WAPM_API_GRAPHQL || 'https://registry.wapm.io/graphql'
  return got.post(endpoint, { json }).json<T>()
}
