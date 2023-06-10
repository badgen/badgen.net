import staticBadge from '../pages/api/static'
import github from '../pages/api/github'
import winget from '../pages/api/winget'
import xo from '../pages/api/xo'

export default {
  static: staticBadge.meta,
  github: github.meta,
  winget: winget.meta,
  xo: xo.meta
}
