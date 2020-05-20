import cheerio from 'cheerio'
import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
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
  const $ = cheerio.load(html)

  const text = (el: any) => $(el).text().trim()

  switch (topic) {
    case 'likes': {
      const likes = parseInt(text('#likes-count'), 10)
      return {
        subject: 'likes',
        status: millify(likes),
        color: 'green'
      }
    }
    case 'dart-platform': {
      const platforms = $('.-pub-tag-badge .tag-badge-main')
        .filter((_, el) => text(el).toLowerCase() === 'dart')
        .nextAll('.tag-badge-sub')
        .map((_, el) => text(el)).get()
        .join(' | ')

      return {
        subject: 'dart',
        status: platforms || 'not supported',
        color: platforms ? 'blue' : 'grey'
      }
    }
    case 'flutter-platform': {
      const platforms = $('.-pub-tag-badge .tag-badge-main')
        .filter((_, el) => text(el).toLowerCase() === 'flutter')
        .nextAll('.tag-badge-sub')
        .map((_, el) => text(el)).get()
        .join(' | ')

      return {
        subject: 'flutter',
        status: platforms || 'not supported',
        color: platforms ? 'blue' : 'grey'
      }
    }
    case 'license': {
      const $license = $('.title')
        .filter((_, el) => text(el).toLowerCase() === 'license')
        .next('p')

      const [license] = text($license).split(/\s+\(LICENSE/)

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
