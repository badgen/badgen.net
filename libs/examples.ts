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
  'travis',
  'circleci',
  'appveyor',
  'codecov',
  'coveralls',
  'codeclimate',
  'azure-piplines',
  // quality & metrics
  'lgtm',
  'uptime-robot',
  'xo',
  'badgesize',
  'jsdelivr',
  'opencollective'
  // utilities
]

export async function loadExamples () {
  const liveBadgeExamples = await Promise.all(liveBadgeList.map(async name => {
    const { meta: { title, examples } } = await import(rel('../endpoints', name))
    return {
      title: title || name,
      examples
    }
  }))

  return {
    live: liveBadgeExamples,
    static: staticBadgeExamples
  }
}
