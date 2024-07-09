import staticBadge from '../pages/api/static'
import github from '../pages/api/github'
import gitlab from '../pages/api/gitlab'
import https from '../pages/api/https'
import memo from '../pages/api/memo'
import amo from '../pages/api/amo'
import npm from '../pages/api/npm'
import pub from '../pages/api/pub'
import crates from '../pages/api/crates'
import docker from '../pages/api/docker'
import bundlephobia from '../pages/api/bundlephobia'
import packagephobia from '../pages/api/packagephobia'
import codeclimate from '../pages/api/codeclimate'
import codecov from '../pages/api/codecov'
import coveralls from '../pages/api/coveralls'
import travis from '../pages/api/travis'
import circleci from '../pages/api/circleci'
import chromeWebStore from '../pages/api/chrome-web-store'
import vsMarketplace from '../pages/api/vs-marketplace'
import openVsx from '../pages/api/open-vsx'
import hackage from '../pages/api/hackage'
import pypi from '../pages/api/pypi'
import peertube from '../pages/api/peertube'
import discord from '../pages/api/discord'
import matrix from '../pages/api/matrix'
import runkit from '../pages/api/runkit'
import winget from '../pages/api/winget'
import xo from '../pages/api/xo'
import liberapay from 'pages/api/liberapay'

export default {
  static: staticBadge.meta,
  github: github.meta,
  gitlab: gitlab.meta,
  https: https.meta,
  memo: memo.meta,
  amo: amo.meta,
  npm: npm.meta,
  pub: pub.meta,
  crates: crates.meta,
  docker: docker.meta,
  'open-vsx': openVsx.meta,
  'chrome-web-store': chromeWebStore.meta,
  'vs-marketplace': vsMarketplace.meta,
  hackage: hackage.meta,
  pypi: pypi.meta,
  winget: winget.meta,
  bundlephobia: bundlephobia.meta,
  packagephobia: packagephobia.meta,
  codeclimate: codeclimate.meta,
  codecov: codecov.meta,
  coveralls: coveralls.meta,
  travis: travis.meta,
  circleci: circleci.meta,
  peertube: peertube.meta,
  discord: discord.meta,
  matrix: matrix.meta,
  runkit: runkit.meta,
  xo: xo.meta,
  liberapay: liberapay.meta,
}
