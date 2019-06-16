import path from 'path'
import { examples as staticBadgeExamples } from '../endpoints/badge'

const rel = (...args) => path.resolve(__dirname, ...args)

// sort live badge manually
export const liveBadgeList = [
  // source control
  'github',
  // release registries
  'npm',
  'david',
  'packagephobia',
  'bundlephobia',
  'crates',
  'docker',
  'homebrew',
  'chrome-web-store',
  'amo',
  'pypi',
  'nuget',
  'packagist',
  'rubygems',
  'apm',
  'hackage',
  'vs-marketplace',
  // CI
  'zeit-now',
  'travis',
  'circleci',
  'appveyor',
  'codecov',
  'coveralls',
  'codeclimate',
  'azure-pipelines',
  // quality & metrics
  'lgtm',
  'uptime-robot',
  'xo',
  'badgesize',
  'jsdelivr',
  // utilities
  'opencollective',
  'keybase',
  'twitter',
  'runkit',
  'https',
]

export async function loadBadgeMeta () {
  const liveBadgeExamples = await Promise.all(liveBadgeList.map(async id => {
    const { meta, handlers } = await import(rel('../endpoints', id))
    const { title, examples, help } = meta

    return {
      id,
      title,
      examples,
      routes: Object.keys(handlers),
      help
    }
  }))

  return {
    live: liveBadgeExamples,
    static: staticBadgeExamples
  }
}
