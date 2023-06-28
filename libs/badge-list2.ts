import staticBadge from '../pages/api/static'
import github from '../pages/api/github'
import npm from '../pages/api/npm'
import bundlephobia from '../pages/api/bundlephobia'
import packagephobia from '../pages/api/packagephobia'
import chromeWebStore from '../pages/api/chrome-web-store'
import hackage from '../pages/api/hackage'
import pypi from '../pages/api/pypi'
import runkit from '../pages/api/runkit'
import winget from '../pages/api/winget'
import xo from '../pages/api/xo'

export default {
  static: staticBadge.meta,
  github: github.meta,
  npm: npm.meta,
  bundlephobia: bundlephobia.meta,
  packagephobia: packagephobia.meta,
  'chrome-web-store': chromeWebStore.meta,
  hackage: hackage.meta,
  pypi: pypi.meta,
  runkit: runkit.meta,
  winget: winget.meta,
  xo: xo.meta
}
