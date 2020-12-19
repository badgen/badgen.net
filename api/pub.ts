import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, BadgenError, PathArgs } from '../libs/create-badgen-handler'

const PUB_REPO_URL = 'https://pub.dev/'

const client = got.extend({ prefixUrl: PUB_REPO_URL })

export default createBadgenHandler({
  title: 'Dart pub',
  examples: {
    '/pub/v/kt_dart': 'version',
    '/pub/v/mobx': 'version',
    '/pub/license/pubx': 'license',
    '/pub/likes/firebase_core': 'likes',
    '/pub/sdk-version/uuid': 'sdk-version',
    '/pub/dart-platform/rxdart': 'dart-platform',
    '/pub/dart-platform/google_sign_in': 'dart-platform',
    '/pub/flutter-platform/xml': 'flutter-platform'
  },
  handlers: {
    '/pub/:topic<v|sdk-version>/:pkg': apiHandler,
    '/pub/:topic<likes|dart-platform|flutter-platform|license>/:pkg': webHandler
  }
})

async function apiHandler ({ topic, pkg }: PathArgs) {
  const headers = { accept: 'application/vnd.pub.v2+json' }
  const { latest: info } = await client.get(`api/packages/${pkg}`, { headers }).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: 'pub',
        status: version(info.version),
        color: versionColor(info.version)
      }
    case 'sdk-version':
      const sdkVersion = info.pubspec?.environment?.sdk || 'unknown'
      return {
        subject: 'dart sdk',
        status: version(sdkVersion),
        color: versionColor(sdkVersion)
      }
  }
}

async function webHandler({ topic, pkg }: PathArgs) {
  const html = await fetchPage(pkg)

  switch (topic) {
    case 'likes': {
      const likes = html.match(/id="likes-count">([^<]+)</i)?.[1].trim() ?? ''
      return {
        subject: 'likes',
        status: likes,
        color: 'green'
      }
    }
    case 'dart-platform': {
      const platforms = [...html.matchAll(/class="tag-badge-sub" title=".*?\bDart\b.*?">([^<]+)<\//ig)]
        .map(match => match[1].trim())
        .join(' | ')

      return {
        subject: 'dart',
        status: platforms || 'not supported',
        color: platforms ? 'blue' : 'grey'
      }
    }
    case 'flutter-platform': {
      const platforms = [...html.matchAll(/class="tag-badge-sub" title=".*?\bFlutter\b.*?">([^<]+)<\//ig)]
        .map(match => match[1].trim())
        .join(' | ')

      return {
        subject: 'flutter',
        status: platforms || 'not supported',
        color: platforms ? 'blue' : 'grey'
      }
    }
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

async function fetchPage(pkg: string) {
  const resp = await client.get(`packages/${pkg}`, { followRedirect: false })
  if (resp.headers.location) {
    throw new BadgenError({ status: 404 })
  }
  return resp.body
}
