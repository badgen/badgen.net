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
import jsdelivr from '../pages/api/jsdelivr'
import bundlephobia from '../pages/api/bundlephobia'
import bundlejs from '../pages/api/bundlejs'
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
import rubygems from '../pages/api/rubygems'
import homebrew from '../pages/api/homebrew'
import nuget from '../pages/api/nuget'
import packagist from '../pages/api/packagist'
import melpa from '../pages/api/melpa'
import maven from '../pages/api/maven'
import cocoapods from '../pages/api/cocoapods'
import haxelib from '../pages/api/haxelib'
import opam from '../pages/api/opam'
import cpan from '../pages/api/cpan'
import cran from '../pages/api/cran'
import ctan from '../pages/api/ctan'
import dub from '../pages/api/dub'
import elmPackage from '../pages/api/elm-package'
import scoop from '../pages/api/scoop'
import fDroid from '../pages/api/f-droid'
import shards from '../pages/api/shards'
import wapm from '../pages/api/wapm'
import snapcraft from '../pages/api/snapcraft'
import appveyor from '../pages/api/appveyor'
import codacy from '../pages/api/codacy'
import azurePipelines from '../pages/api/azure-pipelines'
import jenkins from '../pages/api/jenkins'
import dependabot from '../pages/api/dependabot'
import snyk from '../pages/api/snyk'
import deepscan from '../pages/api/deepscan'
import uptimeRobot from '../pages/api/uptime-robot'
import badgesize from '../pages/api/badgesize'
import devrant from '../pages/api/devrant'
import reddit from '../pages/api/reddit'
import opencollective from '../pages/api/opencollective'
import keybase from '../pages/api/keybase'
import mastodon from '../pages/api/mastodon'
import tidelift from '../pages/api/tidelift'

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
  jsdelivr: jsdelivr.meta,
  bundlephobia: bundlephobia.meta,
  bundlejs: bundlejs.meta,
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
  rubygems: rubygems.meta,
  homebrew: homebrew.meta,
  nuget: nuget.meta,
  packagist: packagist.meta,
  melpa: melpa.meta,
  maven: maven.meta,
  cocoapods: cocoapods.meta,
  haxelib: haxelib.meta,
  opam: opam.meta,
  cpan: cpan.meta,
  cran: cran.meta,
  ctan: ctan.meta,
  dub: dub.meta,
  'elm-package': elmPackage.meta,
  scoop: scoop.meta,
  'f-droid': fDroid.meta,
  shards: shards.meta,
  wapm: wapm.meta,
  snapcraft: snapcraft.meta,
  appveyor: appveyor.meta,
  codacy: codacy.meta,
  'azure-pipelines': azurePipelines.meta,
  jenkins: jenkins.meta,
  dependabot: dependabot.meta,
  snyk: snyk.meta,
  deepscan: deepscan.meta,
  'uptime-robot': uptimeRobot.meta,
  badgesize: badgesize.meta,
  devrant: devrant.meta,
  reddit: reddit.meta,
  opencollective: opencollective.meta,
  keybase: keybase.meta,
  mastodon: mastodon.meta,
  tidelift: tidelift.meta,
}
