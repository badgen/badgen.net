import path from 'path'
import fse from 'fs-extra'
import { loadBadgeMeta } from '../libs/badge-list'

const rel = (...args) => path.resolve(__dirname, ...args)

async function main () {
  const badgeMeta = await loadBadgeMeta()
  await fse.outputJson(rel('../static/.meta/badges.json'), badgeMeta)
}

main()

process.on('unhandledRejection', console.error)
