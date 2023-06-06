import got from '../libs/got'
import { coerce, compare, SemVer } from 'semver'
import { version, versionColor, millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Pypi',
  examples: {
    '/pypi/v/pip': 'version',
    '/pypi/v/docutils': 'version',
    '/pypi/license/pip': 'license',
    '/pypi/python/black': 'python version',
    '/pypi/dd/pip': 'daily downloads',
    '/pypi/dw/pip': 'weekly downloads',
    '/pypi/dm/pip': 'monthly downloads'
  },
  handlers: {
    '/pypi/:topic<v|license|python>/:project': handler,
    '/pypi/:topic<dd|dw|dm>/:project': statsHandler
  }
})

async function handler({ topic, project }: PathArgs) {
  const endpoint = `https://pypi.org/pypi/${project}/json`
  const { info } = await got(endpoint).json<any>()

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
    case 'python': {
      const { standard, exclusive } = readVersions(info.classifiers)
      const versions = (standard.length ? standard : exclusive).join(' | ')
      return {
        subject: 'python',
        status: versions || 'unknown',
        color: versions ? 'blue' : 'grey'
      }
    }
  }
}

async function statsHandler({ topic, project }: PathArgs) {
  const endpoint = `https://pypistats.org/api/packages/${project}/recent`
  const { data } = await got(endpoint).json<any>()

  switch (topic) {
    case 'dd':
      return {
        subject: 'downloads',
        status: `${millify(data.last_day)}/day`,
        color: 'green'
      }
    case 'dw':
      return {
        subject: 'downloads',
        status: `${millify(data.last_week)}/week`,
        color: 'green'
      }
    case 'dm':
      return {
        subject: 'downloads',
        status: `${millify(data.last_month)}/month`,
        color: 'green'
      }
  }
}

function readVersions(classifiers: string[]) {
  const reVersionClassifier = /^Programming Language :: Python :: ([\d.]+)( :: Only)?$/i
  const versions = classifiers.reduce((acc, classifier) => {
    const match = classifier.match(reVersionClassifier)
    if (!match) return acc
    const [, source, isExclusive] = match
    const version = coerce(source)
    if (!version) return acc
    const versionDict = isExclusive ? acc.exclusive : acc.standard
    versionDict.delete(version.major.toString())
    versionDict.set(source, version)
    return acc
  }, {
    standard: new Map<string, SemVer>(),
    exclusive: new Map<string, SemVer>()
  })
  const compareFn = (source1: string, source2: string, versionDict: Map<string, SemVer>) => {
    return compare(versionDict.get(source1)!, versionDict.get(source2)!)
  }
  return {
    standard: sortKeys(versions.standard, compareFn),
    exclusive: sortKeys(versions.exclusive, compareFn)
  }
}

function sortKeys<K, V>(map: Map<K, V>, compareFn: (a: K, b: K, map: Map<K, V>) => number) {
  return Array.from(map.keys()).sort((a, b) => compareFn(a, b, map))
}
