import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import BadgeList2 from '../libs/badge-list2'

async function main () {
  const directory = path.resolve(__dirname, '../public/.meta')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'badge-list.json'), JSON.stringify(BadgeList2, null, 2) + '\n')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
