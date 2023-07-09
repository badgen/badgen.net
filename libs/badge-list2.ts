import staticBadge from '../pages/api/static'
import github from '../pages/api/github'
import amo from '../pages/api/amo'
import npm from '../pages/api/npm'
import crates from '../pages/api/crates'
import bundlephobia from '../pages/api/bundlephobia'
import packagephobia from '../pages/api/packagephobia'
import codeclimate from '../pages/api/codeclimate'
import codecov from '../pages/api/codecov'
import travis from '../pages/api/travis'
import chromeWebStore from '../pages/api/chrome-web-store'
import vsMarketplace from '../pages/api/vs-marketplace'
import hackage from '../pages/api/hackage'
import pypi from '../pages/api/pypi'
import peertube from '../pages/api/peertube'
import discord from '../pages/api/discord'
import matrix from '../pages/api/matrix'
import runkit from '../pages/api/runkit'
import winget from '../pages/api/winget'
import xo from '../pages/api/xo'

export default {
  static: staticBadge.meta,
  github: github.meta,
  amo: amo.meta,
  npm: npm.meta,
  crates: crates.meta,
  'chrome-web-store': chromeWebStore.meta,
  'vs-marketplace': vsMarketplace.meta,
  hackage: hackage.meta,
  pypi: pypi.meta,
  winget: winget.meta,
  bundlephobia: bundlephobia.meta,
  packagephobia: packagephobia.meta,
  codeclimate: codeclimate.meta,
  codecov: codecov.meta,
  travis: travis.meta,
  peertube: peertube.meta,
  discord: discord.meta,
  matrix: matrix.meta,
  runkit: runkit.meta,
  xo: xo.meta
}
