import path from 'path'
import staticBadges from '../pages/api/static'

const rel = (...args) => path.resolve(__dirname, ...args)

// sort live badge manually
export const liveBadgeList = [
  // // source control
  // 'github',
  // 'gitlab',
  // release registries
  'homebrew',
  'nuget',
  'packagist',
  'rubygems',
  'melpa',
  'maven',
  'cocoapods',
  'haxelib',
  'opam',
  'cpan',
  'cran',
  'ctan',
  'dub',
  'elm-package',
  'scoop',
  'f-droid',
  'shards',
  'wapm',
  'snapcraft',
  // CI
  'appveyor',
  'codacy',
  'azure-pipelines',
  // quality & metrics
  'snyk',
  'deepscan',
  'uptime-robot',
  'badgesize',
  'jsdelivr',
  // social
  'devrant',
  'reddit',
  // utilities
  'opencollective',
  'keybase',
  'twitter',
  'mastodon',
  'tidelift',
  'jenkins',
]

export async function loadBadgeMeta() {
  const liveBadgeExamples = await Promise.all(liveBadgeList.map(async id => {
    const mod = await import(rel('../api-legacy', id))
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
