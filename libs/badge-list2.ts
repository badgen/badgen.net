import staticBadge from '../pages/api/static'
import github from '../pages/api/github'
import npm from '../pages/api/npm'
import chromeWebStore from '../pages/api/chrome-web-store'
import winget from '../pages/api/winget'
import xo from '../pages/api/xo'

export default {
  static: staticBadge.meta,
  github: github.meta,
  npm: npm.meta,
  chromeWebStore: chromeWebStore.meta,
  winget: winget.meta,
  xo: xo.meta
}
