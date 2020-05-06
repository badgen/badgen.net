import path from 'path'
import staticBadges from '../api/badge'

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
  'maven',
  'cocoapods',
  'haxelib',
  // CI
  'travis',
  'circleci',
  'appveyor',
  'codecov',
  'codacy',
  'coveralls',
  'codeclimate',
  'azure-pipelines',
  // quality & metrics
  'lgtm',
  'uptime-robot',
  'xo',
  'badgesize',
  'jsdelivr',
  'dependabot',
  // utilities
  'opencollective',
  'keybase',
  'twitter',
  'runkit',
  'https',
]

export async function loadBadgeMeta () {
  const liveBadgeExamples = await Promise.all(liveBadgeList.map(async id => {
    const mod = await import(rel('../api', id))
    const { title, examples, handlers } = mod.default.meta

    return {
      id,
      title,
      examples,
      routes: Object.keys(handlers),
    }
  }))

  const statics = {
    title: staticBadges.meta.title,
    examples: staticBadges.meta.examples,
    routes: Object.keys(staticBadges.meta.handlers)
  }

  return {
    live: liveBadgeExamples,
    static: [statics]
  }
}
