import got from '../libs/got'
import { compare, coerce } from 'semver'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Pypi',
  examples: {
    '/pypi/v/pip': 'version',
    '/pypi/v/docutils': 'version',
    '/pypi/license/pip': 'license',
    '/pypi/pyversions/black': 'python version',
  },
  handlers: {
    '/pypi/:topic<v|license|pyversions>/:project': handler
  }
})

// Extract classifiers from a pypi json response based on a regex.
// Source: https://github.com/badges/shields/blob/cf7c9c11471bb227069c013657491d842f6c7940/services/pypi/pypi-helpers.js#L42
function parseClassifiers(parsedInfo: any, pattern: RegExp, preserveCase = false): string[] {
  const results: string[] = []
  for (let i = 0; i < parsedInfo.classifiers.length; i++) {
    const matched = pattern.exec(parsedInfo.classifiers[i])
    if (matched && matched[1]) {
      if (preserveCase) {
        results.push(matched[1])
      } else {
        results.push(matched[1].toLowerCase())
      }
    }
  }
  return results
}

async function handler ({ topic, project }: PathArgs) {
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
    case 'pyversions':
      // Source: https://github.com/badges/shields/blob/cf7c9c11471bb227069c013657491d842f6c7940/services/pypi/pypi-python-versions.service.js

      const versions = parseClassifiers(
        info,
        /^Programming Language :: Python :: ([\d.]+)$/
      )

      // If no versions are found yet, check "X :: Only" as a fallback.
      if (versions.length === 0) {
        versions.push(
          ...parseClassifiers(
            info,
            /^Programming Language :: Python :: (\d+) :: Only$/
          )
        )
      }

      const versionSet: Set<string> = new Set(versions);

      // We only show v2 if eg. v2.4 does not appear.
      // See https://github.com/badges/shields/pull/489 for more.
      ['2', '3'].forEach(majorVersion => {
        if (Array.from(versions).some(v => v.startsWith(`${majorVersion}.`))) {
          versionSet.delete(majorVersion)
        }
      })

      if (versionSet.size == 0) {
        return {
          subject: 'python',
          status: 'missing',
          color: 'red'
        }
      }

      return {
        subject: 'python',
        status: Array.from(versionSet)
          .sort((v1, v2) => {
            try {
              return compare(coerce(v1) ?? v1, coerce(v2) ?? v2)
            } catch (e) {
              if (v1 < v2) return -1
              if (v1 > v2) return 1
              return 0
            }
          })
          .join(' | '),
        color: versions.length ? 'blue' : 'red'
      }
  }
}
