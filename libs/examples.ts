import path from 'path'
import { examples as staticBadgeExamples } from '../endpoints/badge'

const rel = (...args) => path.resolve(__dirname, ...args)

// sort live badge examples manually
const liveBadgeExampleList = [
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
  // CI
  'appveyor',
  // quality & metrics
  // utilities
]

export async function loadExamples () {
  const liveBadgeExamples = await Promise.all(liveBadgeExampleList.map(async name => {
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
