import path from 'path'
import fse from 'fs-extra'
import { loadBadgeMeta } from '../libs/badge-list'
import BadgeList2 from '../libs/badge-list2'

const rel = (...args) => path.resolve(__dirname, ...args)

;(async function main () {
  const badgeMeta = await loadBadgeMeta()
  await fse.outputJson(rel('../public/.meta/badges.json'), badgeMeta, {
    spaces: 2
  })

  await fse.outputJson(rel('../public/.meta/badge-list.json'), BadgeList2, {
    spaces: 2
  })
})()

process.on('unhandledRejection', console.error)
