import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { listed } from '../libs/service-registry.json'
import type { BadgenServeConfig } from '../libs/create-badgen-handler-next'

async function main () {
  // Preserve catalog order; unlisted services keep routes but stay out of public indexes.
  const badges: Record<string, Omit<BadgenServeConfig, 'sMaxAge'>> = {}
  for (const service of listed) {
    // Load handlers only during generation, never from the Next configuration.
    badges[service] = require(`../pages/api/${service}`).default.meta
  }
  const directory = path.resolve(__dirname, '../public/.meta')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'badge-list.json'), JSON.stringify(badges, null, 2) + '\n')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
