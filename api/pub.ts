import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, BadgenError, PathArgs } from '../libs/create-badgen-handler'

const PUB_API_URL = 'https://pub.dev/api/'
const PUB_REPO_URL = 'https://pub.dev/'


export default createBadgenHandler({
  title: 'Dart pub',
  examples: {
    '/pub/v/kt_dart': 'version',
    '/pub/v/mobx': 'version',
    '/pub/license/pubx': 'license',
    '/pub/likes/firebase_core': 'likes',
    '/pub/points/rxdart': 'pub points',
    '/pub/popularity/mobx': 'popularity',
    '/pub/sdk-version/uuid': 'sdk-version',
    '/pub/dart-platform/rxdart': 'dart-platform',
    '/pub/dart-platform/google_sign_in': 'dart-platform',
    '/pub/flutter-platform/xml': 'flutter-platform'
  },
  handlers: {
    '/pub/:topic<v|version|sdk-version|likes|points|popularity|dart-platform|flutter-platform>/:pkg': apiHandler,
    '/pub/:topic<license>/:pkg': webHandler
  }
})

async function apiHandler ({ topic, pkg }: PathArgs) {
  const headers = { accept: 'application/vnd.pub.v2+json' }
  const client = got.extend({ prefixUrl:  PUB_API_URL, headers })

  switch (topic) {
    case 'v':
    case 'version': {
      const { latest: info } = await client.get(`packages/${pkg}`).json<any>()
      return {
        subject: 'pub',
        status: version(info.version),
        color: versionColor(info.version)
      }
    }
    case 'sdk-version':
      const { latest: info } = await client.get(`packages/${pkg}`).json<any>()
      const sdkVersion = info.pubspec?.environment?.sdk || 'unknown'
      return {
        subject: 'dart sdk',
        status: version(sdkVersion),
        color: versionColor(sdkVersion)
      }
    case 'likes': {
      const { likeCount } = await client.get(`packages/${pkg}/score`).json<any>()
      return {
        subject: 'likes',
        status: millify(likeCount),
        color: 'green'
      }
    }
    case 'points': {
      const {
        grantedPoints,
        maxPoints
      } = await client.get(`packages/${pkg}/score`).json<any>()
      return {
        subject: 'points',
        status: `${grantedPoints}/${maxPoints}`,
        color: 'green'
      }
    }
    case 'popularity': {
      const { popularityScore } = await client.get(`packages/${pkg}/score`).json<any>()
      const percentage = popularityScore * 100
      return {
        subject: 'popularity',
        status: `${Math.round(percentage)}%`,
        color: 'green'
      }
    }
    case 'dart-platform': {
      const { scorecard: pubScores } = await client.get(`packages/${pkg}/metrics`).json<any>()
      const sdk = parseTags(pubScores.panaReport.derivedTags, 'sdk').join(' | ')
      return {
        subject: 'dart',
        status: sdk || 'not supported',
        color: sdk ? 'blue' : 'grey'
      }
    }
    case 'flutter-platform': {
      const { scorecard: pubScores } = await client.get(`packages/${pkg}/metrics`).json<any>()
      const platforms = parseTags(pubScores.panaReport.derivedTags, 'platform').join(' | ')
      return {
        subject: 'flutter',
        status: platforms || 'not supported',
        color: platforms ? 'blue' : 'grey'
      }
    }
  }
}

async function webHandler({ topic, pkg }: PathArgs) {
  const html = await fetchPage(pkg)

  switch (topic) {
    case 'license': {
      const license = html.match(/License<\/h3>\s*<p>([^(]+)\(/i)?.[1].trim()
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
  }
}

function parseTags(tags, group)  {
  return Array.from(tags.reduce((acc, tag) => {
    if (!tag.startsWith(`${group}:`)) return acc
    const [, name] = tag.split(':')
    const [type] = name.split('-')
    acc.add(type)
    return acc
  }, new Set()))
}

async function fetchPage(pkg: string) {
  const resp = await got(`packages/${pkg}`, { followRedirect: false, prefixUrl: PUB_REPO_URL })
  if (resp.headers.location) {
    throw new BadgenError({ status: 404 })
  }
  return resp.body
}
