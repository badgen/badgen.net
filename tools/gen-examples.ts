import path from 'path'
import fse from 'fs-extra'
import BadgeList2 from '../libs/badge-list2'

const rel = (...args) => path.resolve(__dirname, ...args)

;(async function main () {
  await fse.outputJson(rel('../public/.meta/badge-list.json'), BadgeList2, {
    spaces: 2
  })
})()

process.on('unhandledRejection', console.error)
